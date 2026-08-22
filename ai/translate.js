const axios = require("axios");
require("dotenv").config();

const HF_TOKEN = process.env.HF_TOKEN;
const MODEL = "meta-llama/Llama-3.3-70B-Instruct";

async function translateText(text, targetLanguage = "English") {
  if (!text || !text.trim()) return text;

  try {
    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `You are a translation engine. Translate the user's message into ${targetLanguage}. Reply with ONLY the translation, no explanation, no quotes.`,
          },
          { role: "user", content: text },
        ],
        temperature: 0.2,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    return response.data?.choices?.[0]?.message?.content?.trim() || text;
  } catch (error) {
    console.error("Translation error:", error.response?.data || error.message);
    return text; // keep bot functional if translation fails
  }
}

module.exports = translateText;