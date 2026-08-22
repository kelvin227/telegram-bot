const { franc } = require("franc");

const languageMap = {
  eng: "en",
  spa: "es",
  fra: "fr",
  deu: "de",
  ita: "it",
  por: "pt",
  rus: "ru",
  ara: "ar",
  hin: "hi",
  ben: "bn",
  jpn: "ja",
  kor: "ko",
  zho: "zh",
  cmn: "zh",
  yor: "yo",
  ibo: "ig",
  hau: "ha",
  swa: "sw",
  tur: "tr",
  ind: "id",
  kir: "ky",
  fas: "fa",
  pes: "fa",
  tgl: "tl",
  fil: "tl",
  vie: "vi",
};


module.exports = languageMap;

// ==========================================
// COMMON LANGUAGE PATTERNS
// ==========================================
const languagePatterns = {
  // ---- narrower scripts first (must come before broader ones below) ----

  ja: [
    /[\u3040-\u30ff]/, // hiragana + katakana — unique to Japanese, doesn't overlap Chinese
  ],

  ko: [
    /[\uac00-\ud7a3]/, // hangul
  ],

  ky: [
    /[өңүӨҢҮ]/, // letters unique to Kyrgyz Cyrillic, not used in Russian
    /\b(салам|рахмат|кандай)\b/i,
  ],

  fa: [
    /[پچژگ]/, // letters unique to Persian, not in standard Arabic
    /\b(سلام|متشکرم|چطور)\b/,
  ],

  // ---- broader scripts (checked after their narrower siblings above) ----

  zh: [
    /[\u4e00-\u9fff]/, // CJK ideographs
  ],

  ru: [
    /[а-яА-ЯёЁ]/, // cyrillic
    /\b(привет|спасибо|как)\b/i,
  ],

  ar: [
    /[\u0600-\u06ff]/, // arabic script
  ],

  hi: [
    /[\u0900-\u097f]/, // devanagari
  ],

  bn: [
    /[\u0980-\u09ff]/, // bengali script
  ],

  // ---- Latin-script languages, word/diacritic based ----

  es: [
    /\b(hola|gracias|qué|como|cómo|por favor)\b/i,
    /[¿¡]/,
  ],

  fr: [
    /\b(bonjour|merci|comment|quoi|vous|je suis)\b/i,
  ],

  pt: [
    /\b(olá|obrigado|obrigada|como|você)\b/i,
  ],

  de: [
    /\b(hallo|danke|wie|was|ich)\b/i,
  ],

  it: [
    /\b(ciao|grazie|come|perché|per favore)\b/i,
  ],

  tr: [
    /\b(merhaba|teşekkür|nasıl|selam|lütfen)\b/i,
    /[şğıİ]/, // characters unique to Turkish
  ],

  id: [
    /\b(halo|terima kasih|apa kabar|selamat|tolong)\b/i,
  ],

  tl: [
    /\b(kumusta|salamat|paano|po|opo)\b/i,
  ],

  vi: [
    /\b(xin chào|cảm ơn|làm sao)\b/i,
    /[đươ]/i, // characters unique to Vietnamese
  ],

  yo: [
    /\b(bawo|ẹ|ṣé|mo fẹ)\b/i,
  ],

  ig: [
    /\b(ndewo|daalụ|kedu)\b/i,
  ],

  ha: [
    /\b(sannu|na gode|yaya)\b/i,
  ],
};

function detectLanguage(text) {
  if (!text || !text.trim()) {
    return {
      code: "en",
      detected: false,
    };
  }

  const cleanText = text.trim().toLowerCase();

  // ==========================================
  // 1. CHECK COMMON LANGUAGE PATTERNS
  // ==========================================

  for (const [code, patterns] of Object.entries(languagePatterns)) {
    const matched = patterns.some((pattern) =>
      pattern.test(cleanText)
    );

    if (matched) {
      return {
        code,
        detected: true,
        source: "pattern",
      };
    }
  }

  // ==========================================
  // 2. VERY SHORT TEXT FALLBACK
  // ==========================================

  if (cleanText.length < 10) {
    return {
      code: "en",
      detected: false,
      source: "short-text-fallback",
    };
  }

  // ==========================================
  // 3. USE FRANC
  // ==========================================

  const detected = franc(cleanText);

  if (detected === "und") {
    return {
      code: "en",
      detected: false,
      source: "fallback",
    };
  }

  // If the detected language is not supported
  // by our translator, fall back to English.
  const code = languageMap[detected] || "en";

  return {
    code,
    detected: code !== "en" || detected === "eng",
    rawCode: detected,
    source: "franc",
  };
}

module.exports = detectLanguage;