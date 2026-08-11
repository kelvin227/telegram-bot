const knowledgeBase = require("../knowledge");

/**
 * Normalize text so that different ways of writing
 * the same thing can be compared.
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Convert a sentence into individual words.
 */
function tokenize(text) {
  return normalizeText(text)
    .split(" ")
    .filter((word) => word.length > 1);
}

/**
 * Flatten the knowledge base into a searchable array.
 */
function buildKnowledgeIndex() {
  const entries = [];

  for (const [categoryKey, category] of Object.entries(knowledgeBase)) {
    if (!category || typeof category !== "object") {
      continue;
    }

    const { title, ...questions } = category;

    for (const [key, entry] of Object.entries(questions)) {
      if (!entry || typeof entry !== "object") {
        continue;
      }

      entries.push({
        category: categoryKey,
        categoryTitle: title,
        key,
        question: entry.question || "",
        keywords: entry.keywords || [],
        answer: entry.answer || "",
        action: entry.action || null,
      });
    }
  }

  return entries;
}

const knowledgeIndex = buildKnowledgeIndex();

/**
 * Calculate how relevant a knowledge entry is
 * to the user's question.
 */
function calculateScore(userQuestion, entry) {
  const question = normalizeText(userQuestion);
  const questionWords = tokenize(userQuestion);

  const entryQuestion = normalizeText(entry.question);

  const entryKeywords = entry.keywords.map(normalizeText);

  let score = 0;

  // --------------------------------------------------
  // 1. Exact question match
  // --------------------------------------------------

  if (question === entryQuestion) {
    score += 100;
  }

  // --------------------------------------------------
  // 2. Exact phrase match
  // --------------------------------------------------

  if (question.includes(entryQuestion)) {
    score += 50;
  }

  // --------------------------------------------------
  // 3. Keyword matching
  // --------------------------------------------------

  for (const keyword of entryKeywords) {
    if (!keyword) continue;

    // Full keyword/phrase exists in user's question
    if (question.includes(keyword)) {
      score += 20;
      continue;
    }

    // Compare individual words
    const keywordWords = tokenize(keyword);

    for (const keywordWord of keywordWords) {
      if (questionWords.includes(keywordWord)) {
        score += 5;
      }
    }
  }

  // --------------------------------------------------
  // 4. Question word overlap
  // --------------------------------------------------

  const entryQuestionWords = tokenize(entry.question);

  for (const word of entryQuestionWords) {
    if (questionWords.includes(word)) {
      score += 3;
    }
  }

  return score;
}

/**
 * Search the knowledge base.
 *
 * Returns the most relevant entries.
 */
function searchKnowledge(userQuestion, options = {}) {
  const {
    limit = 3,
    minScore = 5,
  } = options;

  if (!userQuestion || typeof userQuestion !== "string") {
    return [];
  }

  const results = knowledgeIndex
    .map((entry) => ({
      ...entry,
      score: calculateScore(userQuestion, entry),
    }))
    .filter((entry) => entry.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}

/**
 * Get only the best knowledge-base result.
 */
function findBestMatch(userQuestion) {
  const results = searchKnowledge(userQuestion, {
    limit: 1,
  });

  return results.length > 0 ? results[0] : null;
}

module.exports = {
  searchKnowledge,
  findBestMatch,
};