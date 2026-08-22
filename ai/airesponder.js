const axios = require("axios");
const knowledgeSearch = require("./knowledgeSearch");
const detectLanguage = require("./languageDetector");
const translateText= require("./translate.js");

require("dotenv").config();

const HF_TOKEN = process.env.HF_TOKEN;

// Main AI model
const MODEL = "meta-llama/Llama-3.3-70B-Instruct";

async function generateAIResponse(userMessage) {
  try {
    console.log("\n==============================");
    console.log("ORIGINAL USER MESSAGE:", userMessage);

    // ==========================================
    // 1. DETECT USER LANGUAGE
    // ==========================================

    const languageResult = detectLanguage(userMessage);

    console.log("DETECTED LANGUAGE:", languageResult);

    const userLang = languageResult.code || "en";

    // ==========================================
    // 2. TRANSLATE USER MESSAGE TO ENGLISH
    // ==========================================

    let englishMessage = userMessage;

    if (userLang !== "en") {
      console.log(
        `Translating user message from ${userLang} to English...`,
      );

      englishMessage = await translateText(
        userMessage,
        "en",
      );
    }

    console.log("ENGLISH MESSAGE:", englishMessage);

    // Normalize the ENGLISH message for
    // greetings, gratitude and farewells
    const message = englishMessage
      .toLowerCase()
      .trim();

    // ==========================================
    // 3. HELPER FUNCTION
    // Translate response back to user's language
    // ==========================================

    async function respond(text, extra = {}) {
      let finalAnswer = text;

      if (userLang !== "en") {
        console.log(
          `Translating response from English to ${userLang}...`,
        );

        finalAnswer = await translateText(
          text,
          userLang,
        );
      }

      return {
        success: true,
        answer: finalAnswer,
        language: userLang,
        ...extra,
      };
    }

    // ==========================================
    // 4. GREETINGS
    // ==========================================

    const greetings = [
      "hi",
      "hello",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
      "how are you",
      "how are you doing",
    ];

    if (greetings.includes(message)) {
      return await respond(
        "Hello 👋 I'm the JBC Support Assistant. How can I help you today?",
        {
          matched: true,
          type: "greeting",
        },
      );
    }

    // ==========================================
    // 5. GRATITUDE
    // ==========================================

    const gratitudePatterns = [
      /\bthank(s| you)?\b/i,
      /\bthx\b/i,
      /\bty\b/i,
      /\bappreciate\b/i,
    ];

    const isGratitude = gratitudePatterns.some(
      (pattern) => pattern.test(message),
    );

    if (isGratitude) {
      const gratitudeResponses = [
        "You're welcome 😊",
        "You're very welcome! 😊",
        "Glad I could help!",
        "No problem 😊 Feel free to ask if you need anything else.",
        "Happy to help! 👋",
      ];

      const response =
        gratitudeResponses[
          Math.floor(
            Math.random() * gratitudeResponses.length,
          )
        ];

      return await respond(response, {
        matched: true,
        type: "gratitude",
      });
    }

    // ==========================================
    // 6. FAREWELLS
    // ==========================================

    const farewells = [
      "bye",
      "goodbye",
      "see you",
      "bye bye",
      "good night",
    ];

    if (farewells.includes(message)) {
      return await respond(
        "You're welcome! 👋 Feel free to message me anytime if you need help with JBC.",
        {
          matched: true,
          type: "farewell",
        },
      );
    }

    // ==========================================
    // 7. SEARCH JBC KNOWLEDGE BASE
    // IMPORTANT:
    // Search using the translated English message
    // ==========================================

    const searchResult =
      knowledgeSearch.searchKnowledge(
        englishMessage,
      );

    // Supports both:
    //
    // Object:
    // { question, answer, score }
    //
    // Or array:
    // [{ question, answer, score }]
    //
    const result = Array.isArray(searchResult)
      ? searchResult[0]
      : searchResult;

    console.log("KNOWLEDGE SEARCH RESULT:");
    console.log(result);

    // ==========================================
    // 8. NO KNOWLEDGE MATCH
    // ==========================================

    if (!result || !result.answer) {
      return await respond(
        "I'm not able to find a reliable answer to that question from the information I have. Please contact our support team so a human agent can assist you.",
        {
          matched: false,
          type: "fallback",
        },
      );
    }

    // ==========================================
    // 9. BUILD AI SYSTEM PROMPT
    // ==========================================

    const systemPrompt = `
You are the JBC Support Assistant.

Your job is to help JBC users by answering their questions naturally and conversationally.

IMPORTANT RULES:

1. Use ONLY the provided JBC knowledge when answering questions about JBC.

2. Do not invent policies, features, dates, token values, fees, procedures, or other information.

3. Do not contradict the provided knowledge.

4. Rewrite the information naturally so that it sounds like a helpful human support agent.

5. Keep responses concise and easy to understand.

6. You may use emojis when appropriate.

7. Do not mention the knowledge base, AI, prompt, model, or internal system.

8. Answer the user's actual question using the approved information.

9. Do not add information that is not present in the approved answer.

10. If the approved answer does not contain enough information, do not guess or invent missing details.

11. your response MUST be written in english.

12. Do not respond in the user's original language.
13. The translation layer will translate your response afterward.
`;

    // ==========================================
    // 10. BUILD USER PROMPT
    // ==========================================

    const userPrompt = `
JBC KNOWLEDGE:

Category:
${result.categoryTitle || result.category || "JBC Support"}

Question covered:
${result.question || "N/A"}

Approved answer:
${result.answer}

USER MESSAGE:
${englishMessage}

Write a natural, helpful, and concise response.

Remember:
Only use information from the approved answer.
Do not invent additional JBC information.
`;

    // ==========================================
    // 11. SEND TO HUGGING FACE
    // ==========================================

    console.log("Sending request to AI...");

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: MODEL,

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],

        temperature: 0.3,

        max_tokens: 250,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },

        timeout: 60000,
      },
    );

    // ==========================================
    // 12. EXTRACT AI RESPONSE
    // ==========================================

    let answer =
      response.data?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error(
        "Hugging Face returned an empty response.",
      );
    }

    console.log("AI ENGLISH RESPONSE:");
    console.log(answer);

    // ==========================================
    // 13. TRANSLATE RESPONSE BACK
    // ==========================================

    if (userLang !== "en") {
      console.log(
        `Translating AI response to ${userLang}...`,
      );

      answer = await translateText(
        answer,
        userLang,
      );
    }

    console.log("FINAL RESPONSE:");
    console.log(answer);

    // ==========================================
    // 14. RETURN RESPONSE
    // ==========================================

    return {
      success: true,
      answer,
      matched: true,
      knowledgeKey: result.key,
      language: userLang,
      type: "knowledge",
    };

  } catch (error) {
    console.error(
      "AI response error:",
      error.response?.data || error.message,
    );

    return {
      success: false,
      answer:
        "Sorry, I'm having trouble processing your request right now. Please try again or contact our support team.",
      matched: false,
      language: "en",
    };
  }
}

module.exports = generateAIResponse;