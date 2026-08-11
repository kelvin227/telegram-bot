const axios = require("axios");
const knowledgeSearch = require("./knowledgeSearch");
require("dotenv").config();

const HF_TOKEN = process.env.HF_TOKEN;

// Start with a conversational instruction-following model.
// We can change this model later if testing shows another one performs better.
const MODEL = "Qwen/Qwen2.5-7B-Instruct";

async function generateAIResponse(userMessage) {
  try {

    console.log("\n==============================");
    console.log("USER MESSAGE:", userMessage);

    // 1. Search our approved JBC knowledge base
    const results = knowledgeSearch.searchKnowledge(userMessage);

    const result = results?.[0];

    console.log("KNOWLEDGE SEARCH RESULT:");
    console.log(result);

    // 2. Nothing relevant was found
    if (!result || !result.answer) {
      return {
        success: true,
        answer:
          "I'm not able to find a reliable answer to that question from the information I have. Please contact our support team so a human agent can assist you.",
        matched: false,
      };
    }

    // 3. Build the prompt for Hugging Face
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
8. If the user's question cannot be answered using the provided knowledge, clearly say that a human support agent should assist them.
9. If the user asks a follow-up question related to the same topic, answer using the provided knowledge.
`;

    const userPrompt = `
JBC KNOWLEDGE:

Title:
${result.title || "JBC Support"}

Question covered:
${result.question || "N/A"}

Approved answer:
${result.answer}

USER MESSAGE:
${userMessage}

Write a natural and helpful response to the user.
`;

    // 4. Send the request to Hugging Face
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
        timeout: 30000,
      }
    );

    // 5. Extract the generated response
    const answer =
      response.data?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error("Hugging Face returned an empty response.");
    }

    return {
      success: true,
      answer,
      matched: true,
      knowledgeKey: result.key,
    };
  } catch (error) {
    console.error(
      "AI response error:",
      error.response?.data || error.message
    );

    return {
      success: false,
      answer:
        "Sorry, I'm having trouble processing your request right now. Please try again or contact our support team.",
      matched: false,
    };
  }
}

module.exports = generateAIResponse;