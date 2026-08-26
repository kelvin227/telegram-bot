function detectSpam(message) {
  const text = message.toLowerCase().trim();

  // ==========================================
  // 1. LINK DETECTION
  // ==========================================

  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|t\.me\/[^\s]+)/gi;

  const links = text.match(urlRegex) || [];

  // Too many links
  if (links.length >= 2) {
    return {
      isSpam: true,
      reason: "excessive_links",
      message: "Too many links detected.",
    };
  }

  // ==========================================
  // 2. TELEGRAM PROMOTION
  // ==========================================

  const telegramPatterns = [
    /t\.me\//i,
    /join my (group|channel)/i,
    /join our (group|channel)/i,
    /subscribe to my channel/i,
    /join this channel/i,
  ];

  const hasTelegramPromotion = telegramPatterns.some((pattern) =>
    pattern.test(text),
  );

  if (hasTelegramPromotion) {
    return {
      isSpam: true,
      reason: "telegram_promotion",
      message: "Unauthorized Telegram promotion detected.",
    };
  }

  // ==========================================
  // 3. COMMON SPAM / SCAM PHRASES
  // ==========================================
  const spamPatterns = [
    // ==========================================
    // SCAMS / INVESTMENT FRAUD
    // ==========================================
    /double your (money|crypto|investment)/i,
    /triple your (money|crypto|investment)/i,
    /multiply your (money|crypto|investment)/i,
    /turn .* into .* (profit|money|crypto)/i,
    /guaranteed profit/i,
    /guaranteed returns?/i,
    /100% profit/i,
    /100% returns?/i,
    /instant profit/i,
    /risk[- ]free profit/i,
    /risk[- ]free investment/i,
    /no risk.*profit/i,
    /daily guaranteed income/i,
    /guaranteed daily income/i,
    /earn.*(?:daily|weekly).*guaranteed/i,

    // ==========================================
    // SEND CRYPTO SCAMS
    // ==========================================
    /send.*(?:bnb|usdt|crypto|bitcoin|eth|ethereum).*get/i,
    /send.*(?:bnb|usdt|crypto).*receive/i,
    /send.*(?:crypto|bnb|usdt).*back/i,
    /deposit.*(?:bnb|usdt|crypto).*profit/i,
    /invest.*(?:bnb|usdt|crypto).*profit/i,

    // ==========================================
    // FAKE AIRDROPS / GIVEAWAYS
    // ==========================================
    /free (airdrop|crypto|usdt|bnb|bitcoin|eth)/i,
    /claim your free/i,
    /claim free (crypto|usdt|bnb|tokens?)/i,
    /exclusive airdrop/i,
    /limited airdrop/i,
    /airdrop ending soon/i,
    /airdrop.*(?:join|register|claim)/i,
    /giveaway.*(?:crypto|bnb|usdt|money)/i,

    // ==========================================
    // UNSOLICITED PROMOTION / ADVERTISING
    // ==========================================
    /dm me for/i,
    /message me for/i,
    /pm me for/i,
    /inbox me for/i,
    /contact me for/i,
    /join my (group|channel|community)/i,
    /join our (group|channel|community)/i,
    /subscribe to my/i,
    /follow me for/i,
    /check out my (project|token|coin|channel)/i,
    /promote your/i,
    /advertise your/i,

    // ==========================================
    // FINANCIAL PROMOTIONS
    // ==========================================
    /best investment opportunity/i,
    /investment opportunity/i,
    /make money fast/i,
    /earn money fast/i,
    /passive income opportunity/i,
    /financial freedom/i,
    /become rich/i,
    /get rich quick/i,
    /earn \$?\d+.*(?:daily|weekly|monthly)/i,
    /make \$?\d+.*(?:daily|weekly|monthly)/i,
    /earn \$?\d+.*(?:daily)/i,
    /make \$?\d+.*(?:daily)/i,
    /earn \$?\d+.*(?:weekly)/i,
    /make \$?\d+.*(?:weekly)/i,
    /earn \$?\d+. monthly/i,
    /make \$?\d+. monthly/i,

    // ==========================================
    // SUSPICIOUS LINKS / PHISHING LANGUAGE
    // ==========================================
    /connect your wallet/i,
    /verify your wallet/i,
    /validate your wallet/i,
    /synchronize your wallet/i,
    /wallet verification required/i,
    /wallet needs verification/i,
    /claim.*before it expires/i,
    /click.*(?:link|here).*claim/i,
    /click.*(?:link|here).*verify/i,
    /limited time.*(?:offer|airdrop|giveaway|only)/i,


    // ==========================================
    // FAKE SUPPORT / IMPERSONATION
    // ==========================================
    /official support.*dm/i,
    /support team.*message me/i,
    /contact me.*support/i,
    /i am.*(?:admin|support|moderator).*help/i,

    // ==========================================
    // COMMON CRYPTO SCAM WORDING
    // ==========================================
    /pre[- ]?sale/i,
    /private sale/i,
    /token sale.*limited/i,
    /next 100 investors/i,
    /whitelist.*now/i,
    /early investors?/i,
    /don't miss this opportunity/i,
    /act now/i,
  ];
  const hasSpamPhrase = spamPatterns.some((pattern) => pattern.test(text));

  if (hasSpamPhrase) {
    return {
      isSpam: true,
      reason: "suspicious_phrase",
      message: "Potential spam or scam content detected.",
    };
  }

  // ==========================================
  // 4. NO SPAM DETECTED
  // ==========================================

  return {
    isSpam: false,
    reason: null,
    message: null,
  };
}

module.exports = detectSpam;
