// ============================================================
// spamDetector.js — weighted scoring spam/scam detector
//
// Instead of "any single regex match = spam", every signal
// (links, scam phrases, emoji spam, caps spam, flooding,
// suspicious usernames, evasion tricks) contributes a score.
// A message is blocked once the accumulated score crosses
// SPAM_THRESHOLD. This catches combinations of weaker signals
// that a pure any-match model misses, and is far harder to
// evade with paraphrasing or obfuscation.
// ============================================================

// --------------------------------------------------------
// Tunables
// --------------------------------------------------------
const SPAM_THRESHOLD = 50; // score >= this => delete
const REVIEW_THRESHOLD = 30; // score >= this (but < SPAM_THRESHOLD) => flag for review, don't delete

const FLOOD_WINDOW_MS = 15_000; // look-back window for flood detection
const FLOOD_MAX_MESSAGES = 4; // messages from same user in window before flagged
const FLOOD_HISTORY_TTL_MS = 5 * 60_000; // stop tracking a user after this long of inactivity

// --------------------------------------------------------
// Per-user recent message history (in-memory; swap for Redis
// if you run multiple bot instances / need persistence)
// --------------------------------------------------------
const userHistory = new Map(); // userId -> [{ text, time }]

function pruneHistory(now) {
  for (const [userId, entries] of userHistory) {
    const fresh = entries.filter((e) => now - e.time < FLOOD_HISTORY_TTL_MS);
    if (fresh.length === 0) userHistory.delete(userId);
    else userHistory.set(userId, fresh);
  }
}

// --------------------------------------------------------
// Text normalization — undo common evasion tricks BEFORE
// running any pattern matching against the text.
// --------------------------------------------------------

// Cyrillic / Greek / other-script lookalikes -> Latin
const CONFUSABLES = {
  а: "a", А: "a", е: "e", Е: "e", о: "o", О: "o", р: "p", Р: "p",
  с: "c", С: "c", х: "x", Х: "x", у: "y", У: "y", і: "i", І: "i",
  ѕ: "s", Ѕ: "s", ј: "j", Ј: "j", е́: "e", ẹ: "e", ọ: "o",
  ı: "i", ɑ: "a", ⅼ: "l", Ι: "i", Ο: "o", Α: "a", Β: "b", Ε: "e",
};

// Common leetspeak substitutions
const LEET = {
  0: "o", 1: "l", 3: "e", 4: "a", 5: "s", 7: "t", "$": "s", "@": "a",
};

function stripZeroWidthAndInvisibles(text) {
  // zero-width space/joiner/non-joiner, BOM, soft hyphen, and combining
  // diacritical marks people insert to break up words (e.g. "f‌r‌e‌e")
  return text
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "")
    .replace(/[\u0300-\u036f]/g, "");
}

// Strips Markdown/HTML formatting syntax so it never pollutes keyword
// matching, caps-ratio, or repetition checks. Handles both cases: a
// message that arrives with literal HTML tags (<b>, <a href="">, etc.)
// and one with literal Markdown syntax (**bold**, _italic_, `code`,
// ~~strike~~, ||spoiler||, > quote, # heading).
function stripFormattingSyntax(rawText) {
  let out = String(rawText || "");

  // Preserve the real destination of a masked HTML link before the
  // generic tag-strip below would otherwise delete it along with the
  // tag: <a href="evil.com">Click here</a> -> "Click here evil.com"
  out = out.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis, "$2 $1");

  // Remaining HTML tags -> space (so "word</b>word" doesn't fuse into one token)
  out = out.replace(/<\/?[a-z][^>]*>/gi, " ");

  // Common HTML entities that leak through when tags are parsed out
  out = out
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/gi, "'");

  // Markdown bold/strike/code/spoiler markers — safe to remove outright
  out = out.replace(/\*{1,3}|~{2,3}|`{1,3}|\|\|/g, "");

  // Markdown italic underscores — only strip when they visibly WRAP a
  // word or phrase ("_join now_" -> "join now"), so real identifiers
  // like "my_username" are left untouched.
  out = out.replace(/(^|\s)_+(\S.*?\S|\S)_+(?=\s|$)/g, "$1$2");

  // Leading blockquote/heading markers at the start of a line
  out = out.replace(/^[ \t]*[>#]{1,6}[ \t]*/gm, "");

  return out;
}

function deconfuse(text) {
  let out = "";
  for (const ch of text) {
    out += CONFUSABLES[ch] ?? ch;
  }
  return out;
}

function deleet(text) {
  // Only de-leet inside word-ish tokens, so we don't mangle real numbers
  // like prices or amounts unnecessarily aggressively — this is a light
  // touch pass used only for keyword matching, not display.
  return text.replace(/[0-9$@]/g, (ch) => LEET[ch] ?? ch);
}

function normalizeForMatching(rawText) {
  const text = stripFormattingSyntax(rawText);
  // NFKD folds decorative Unicode letter variants (𝙈𝘼𝙏𝙃 bold/italic/
  // sans-serif blocks, fullwidth ＡＢＣ, etc.) back to plain Latin —
  // a very common way spam dodges keyword filters.
  let normalized = text.normalize("NFKD");
  normalized = stripZeroWidthAndInvisibles(normalized).toLowerCase();
  normalized = deconfuse(normalized);
  normalized = deleet(normalized);
  return normalized;
}

// Collapses "j o i n   m y   c h a n n e l" style letter-spacing spam
// into "join my channel" so phrase regexes (which need real word
// boundaries) still catch it. Only applied when a message actually
// looks letter-spaced, so normal short words are untouched.
function collapseLetterSpacing(normalized) {
  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length < 6) return normalized;

  const singleCharCount = words.filter((w) => w.length === 1).length;
  if (singleCharCount / words.length < 0.5) return normalized;

  // Merge runs of single-char tokens into words, keep real words as-is
  const merged = [];
  let buffer = "";
  for (const w of words) {
    if (w.length === 1) {
      buffer += w;
    } else {
      if (buffer) {
        merged.push(buffer);
        buffer = "";
      }
      merged.push(w);
    }
  }
  if (buffer) merged.push(buffer);
  return merged.join(" ");
}

// Stricter normalization used for username / exact-token checks
function normalizeTight(text) {
  return normalizeForMatching(text)
    .replace(/[\s\-_.]+/g, "")
    .replace(/[^\p{L}\p{N}@]/gu, "");
}

function getEmojiCount(text) {
  const emojis = text.match(/\p{Extended_Pictographic}/gu);
  return emojis ? emojis.length : 0;
}

function getCapsRatio(text) {
  const letters = text.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 8) return 0; // too short to judge
  const caps = letters.replace(/[^A-Z]/g, "");
  return caps.length / letters.length;
}

function hasExcessiveRepetition(text) {
  // "!!!!!!" "aaaaaaa" "🚀🚀🚀🚀🚀🚀" style spam
  return /(.)\1{5,}/u.test(text);
}

// --------------------------------------------------------
// Signal: links
// --------------------------------------------------------
const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+|t\.me\/[^\s]+|telegram\.me\/[^\s]+)/gi;

function scoreLinks(normalized, entities) {
  let score = 0;
  const reasons = [];

  // Prefer Telegram's own message entities when available — they catch
  // hidden/masked links (text_link) that plain regex on the text misses.
  const entityLinks = Array.isArray(entities)
    ? entities.filter((e) => e.type === "url" || e.type === "text_link")
    : [];

  const regexLinks = normalized.match(URL_REGEX) || [];
  const linkCount = Math.max(entityLinks.length, regexLinks.length);

  if (linkCount >= 2) {
    score += 40;
    reasons.push("excessive_links");
  } else if (linkCount === 1) {
    score += 12;
    reasons.push("single_link");
  }

  if (entityLinks.some((e) => e.type === "text_link")) {
    // A link whose display text differs from its real URL — classic
    // phishing/masking trick ("Click here" -> malicious domain).
    score += 20;
    reasons.push("masked_link");
  }

  return { score, reasons };
}

// --------------------------------------------------------
// Signal: telegram deep links / promotion
// --------------------------------------------------------
function scoreTelegramPromotion(normalized) {
  let score = 0;
  const reasons = [];

  const promoPatterns = [
    /t\.me\//i,
    /join (my|our|this) (group|channel|community)/i,
    /subscribe to (my|our) channel/i,
  ];
  if (promoPatterns.some((p) => p.test(normalized))) {
    score += 35;
    reasons.push("telegram_promotion");
  }

  if (/tg:\/\/resolve\?domain=/i.test(normalized)) {
    score += 40;
    reasons.push("telegram_deep_link");
  }

  return { score, reasons };
}

// --------------------------------------------------------
// Signal: scam / spam phrase categories (each category has its
// own weight instead of being an instant block)
// --------------------------------------------------------
const PHRASE_CATEGORIES = [
  {
    weight: 35,
    reason: "investment_scam",
    patterns: [
      /double your (money|crypto|investment)/i,
      /triple your (money|crypto|investment)/i,
      /multiply your (money|crypto|investment)/i,
      /guaranteed (profit|returns?|daily income)/i,
      /100%\s*(profit|returns?)/i,
      /risk[- ]free (profit|investment)/i,
      /no risk.*profit/i,
    ],
  },
  {
    weight: 35,
    reason: "send_crypto_scam",
    patterns: [
      /send.*(bnb|usdt|crypto|bitcoin|eth(ereum)?).*(get|receive|back)/i,
      /deposit.*(bnb|usdt|crypto).*profit/i,
      /invest.*(bnb|usdt|crypto).*profit/i,
    ],
  },
  {
    weight: 30,
    reason: "fake_airdrop",
    patterns: [
      /free (airdrop|crypto|usdt|bnb|bitcoin|eth)/i,
      /claim (your |free )?(crypto|usdt|bnb|tokens?|airdrop)/i,
      /(exclusive|limited) airdrop/i,
      /airdrop.*(join|register|claim)/i,
      /giveaway.*(crypto|bnb|usdt|money)/i,
    ],
  },
  {
    weight: 20,
    reason: "unsolicited_promotion",
    patterns: [
      /(dm|message|pm|inbox|contact) me for/i,
      /follow me for/i,
      /check out my (project|token|coin|channel)/i,
      /promote your/i,
      /advertise your/i,
    ],
  },
  {
    weight: 25,
    reason: "financial_hype",
    patterns: [
      /(best )?investment opportunity/i,
      /make money fast/i,
      /earn money fast/i,
      /passive income opportunity/i,
      /financial freedom/i,
      /get rich quick/i,
      /earn \$?\d+.*(daily|weekly|monthly)/i,
      /make \$?\d+.*(daily|weekly|monthly)/i,
      /\bvip\s*\d+\b/i,
    ],
  },
  {
    weight: 30,
    reason: "phishing_language",
    patterns: [
      /(connect|verify|validate|synchronize) your wallet/i,
      /wallet (verification required|needs verification)/i,
      /claim.*before it expires/i,
      /click.*(link|here).*(claim|verify)/i,
      /limited time.*(offer|airdrop|giveaway|only)/i,
    ],
  },
  {
    weight: 25,
    reason: "impersonation",
    patterns: [
      /official support.*dm/i,
      /support team.*message me/i,
      /i am.*(admin|support|moderator).*help/i,
    ],
  },
  {
    weight: 15,
    reason: "presale_pressure",
    patterns: [
      /pre[- ]?sale/i,
      /private sale/i,
      /token sale.*limited/i,
      /next \d+ investors/i,
      /whitelist.*now/i,
      /early investors?/i,
      /don'?t miss this opportunity/i,
      /\bact now\b/i,
    ],
  },
  {
    // Unsolicited P2P/OTC "I'll buy your crypto above market rate" scam.
    // Reads as polite, normal prose — no links, no emoji spam — so it
    // needs its own dedicated phrase signals rather than relying on
    // link/style heuristics.
    weight: 35,
    reason: "otc_scam",
    patterns: [
      /buy (your )?(usdt|crypto|bitcoin|btc|eth|bnb).{0,30}(higher|above|premium).{0,25}(market|rate|price)/i,
      /\d{1,3}\s*%\s*[-–to]{1,4}\s*\d{1,3}\s*%.{0,25}(higher|above).{0,20}market/i,
      /(above|higher than).{0,15}market (rate|price)/i,
      /we will transfer the funds?( to you)? first/i,
      /if you have (usdt|crypto|bitcoin|btc|eth|bnb).{0,20}to sell/i,
      /want to sell (your )?(usdt|crypto|bitcoin|btc|eth|bnb)/i,
    ],
  },
  {
    // Solicitation to move the conversation off-platform to close a
    // trade, often paired with a regulatory-workaround excuse.
    weight: 25,
    reason: "unsolicited_trade_contact",
    patterns: [
      /contact me (on|via) (telegram|whatsapp|signal|wechat)/i,
      /due to.{0,50}regulations?.{0,50}(unable|cannot|can'?t).{0,30}(purchase|buy).{0,20}directly/i,
    ],
  },
];

function scorePhrases(normalized) {
  let score = 0;
  const reasons = [];
  const seen = new Set();
  for (const category of PHRASE_CATEGORIES) {
    if (seen.has(category.reason)) continue;
    if (category.patterns.some((p) => p.test(normalized))) {
      score += category.weight;
      reasons.push(category.reason);
      seen.add(category.reason);
    }
  }
  return { score, reasons };
}

// --------------------------------------------------------
// Signal: known bad usernames / handles
// --------------------------------------------------------
const SUSPICIOUS_USERNAMES = ["bcgame_lbot", "rainbonus_play_bot"];

function scoreUsername(tight) {
  const hit = SUSPICIOUS_USERNAMES.some((u) => tight.includes(`@${u}`) || tight.includes(u));
  return hit
    ? { score: 45, reasons: ["known_suspicious_username"] }
    : { score: 0, reasons: [] };
}

// --------------------------------------------------------
// Signal: style-based spam (caps, emoji, repetition)
// --------------------------------------------------------
function scoreStyle(rawText) {
  let score = 0;
  const reasons = [];

  const emojiCount = getEmojiCount(rawText);
  if (emojiCount >= 8) {
    score += 15;
    reasons.push("excessive_emoji");
  } else if (emojiCount >= 5) {
    score += 8;
    reasons.push("elevated_emoji");
  }

  const capsRatio = getCapsRatio(rawText);
  if (capsRatio >= 0.7) {
    score += 15;
    reasons.push("excessive_caps");
  }

  if (hasExcessiveRepetition(rawText)) {
    score += 10;
    reasons.push("character_repetition");
  }

  return { score, reasons };
}

// --------------------------------------------------------
// Signal: flooding — same user posting repeatedly / near-duplicate
// messages in a short window
// --------------------------------------------------------
function scoreFlood(userId, normalized, now) {
  if (!userId) return { score: 0, reasons: [] };

  pruneHistory(now);

  const entries = userHistory.get(userId) || [];
  const recent = entries.filter((e) => now - e.time < FLOOD_WINDOW_MS);

  let score = 0;
  const reasons = [];

  if (recent.length + 1 >= FLOOD_MAX_MESSAGES) {
    score += 25;
    reasons.push("message_flooding");
  }

  const duplicateCount = recent.filter((e) => e.text === normalized).length;
  if (duplicateCount >= 1) {
    score += 20;
    reasons.push("duplicate_message");
  }

  entries.push({ text: normalized, time: now });
  userHistory.set(userId, entries.slice(-20)); // cap memory per user

  return { score, reasons };
}

// --------------------------------------------------------
// Main entry point
// --------------------------------------------------------
/**
 * @param {string} message - raw message text
 * @param {object} [options]
 * @param {string|number} [options.userId] - sender id, enables flood detection
 * @param {Array}  [options.entities] - ctx.message.entities, enables masked-link detection
 * @returns {{isSpam: boolean, needsReview: boolean, score: number, reasons: string[], message: string|null}}
 */
function detectSpam(message, options = {}) {
  const { userId, entities } = options;
  const now = Date.now();

  const normalized = normalizeForMatching(message);
  const collapsed = collapseLetterSpacing(normalized);
  const tight = normalizeTight(message);
  const cleanedRaw = stripFormattingSyntax(String(message || ""));

  const checks = [
    scoreLinks(normalized, entities),
    scoreTelegramPromotion(normalized),
    scoreTelegramPromotion(collapsed),
    scorePhrases(normalized),
    scorePhrases(collapsed),
    scoreUsername(tight),
    scoreStyle(cleanedRaw),
    scoreFlood(userId, normalized, now),
  ];

  // Dedupe by reason so running phrase/promo checks against both the
  // normalized and letter-spacing-collapsed text never double-counts
  // the same signal.
  const reasonWeights = new Map();
  for (const check of checks) {
    for (let i = 0; i < check.reasons.length; i++) {
      const reason = check.reasons[i];
      if (!reasonWeights.has(reason)) {
        // approximate per-signal weight by splitting this check's score
        // evenly across the reasons it produced
        reasonWeights.set(reason, check.score / check.reasons.length);
      }
    }
  }
  let score = 0;
  const reasons = [];
  for (const [reason, weight] of reasonWeights) {
    score += weight;
    reasons.push(reason);
  }
  score = Math.round(score);

  const isSpam = score >= SPAM_THRESHOLD;
  const needsReview = !isSpam && score >= REVIEW_THRESHOLD;

  if (isSpam) {
    console.log(`[spam] score=${score} reasons=${reasons.join(",")} text="${message}"`);
  } else if (needsReview) {
    console.log(`[spam-review] score=${score} reasons=${reasons.join(",")} text="${message}"`);
  }

  return {
    isSpam,
    needsReview,
    score,
    reasons,
    message: isSpam
      ? "Message matched multiple spam signals and was removed."
      : null,
  };
}

module.exports = detectSpam;