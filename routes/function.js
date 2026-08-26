const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
require("dotenv").config();

const group = [
  {chatId: -1002552597707, name: "JBC ARMY", topics: [
      { threadId: 3641, name: "RAIDS" },
      { threadId: 3583, name: "TURKEY GROUP" },
      { threadId: 14583, name: "INDONESIAN GROUP" },
      { threadId: 3587, name: "SPANISH GROUP" },
      { threadId: 3656, name: "INDIAN GROUP" },
      { threadId: 9736, name: "NIGERIA GROUP" },
      { threadId: 218196, name: "CHINESE GROUP" },
      { threadId: 337486, name: "KYRGYZSTAN GROUP" },
      { threadId: 102043, name: "IRAN PERSIAN GROUP" },
      { threadId: 3588, name: "PORTUGUESE BRAZIL GROUP" },
      { threadId: 3586, name: "FRENCH GROUP" },
      { threadId: 218201, name: "VIETNAMESE GROUP" },
      { threadId: 95591, name: "PHILIPPINE GROUP" },
      { threadId: 41291, name: "BANGLADESH GROUP" },
      { threadId: 3585, name: "RUSSIAN GROUP" },
      { threadId: 119028, name: "GHANA GROUP" },
      { threadId: 604059, name: "ITALIAN GROUP" },
      { threadId: 116665, name: "KOREA GROUP" },

    ]},
   /* ... rest of your group chat IDs */];

const API_KEY = process.env.BROADCAST_API_KEY; // set this in your .env

// Layer 1: protects YOUR endpoint from being spammed/abused
const broadcastLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 broadcast requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many broadcast requests, try again later." },
});

const crypto = require("crypto");

function checkApiKey(req, res, next) {
  const key = req.headers["x-api-key"];

  if (!key || !API_KEY) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const keyBuffer = Buffer.from(key);
  const apiKeyBuffer = Buffer.from(API_KEY);

  if (
    keyBuffer.length !== apiKeyBuffer.length ||
    !crypto.timingSafeEqual(keyBuffer, apiKeyBuffer)
  ) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  next();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = function (bot) {
  router.post("/broadcast", checkApiKey, broadcastLimiter, async (req, res) => {
    const { message, link } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ success: false, error: '"message" is required.' });
    }

    const text = link ? `${message}\n\n🔗 ${link}` : message;

    // Respond right away — don't make the caller wait for every group to finish sending.
    res.status(202).json({
      success: true,
      message: `Broadcast queued for ${group.length} groups.`,
    });

    const results = { sent: [], failed: [] };

for (const { chatId, name, topics } of group) {
  const targets = topics && topics.length > 0 ? topics : [{ threadId: null, name: "main" }];

  for (const { threadId, name: topicName } of targets) {
    try {
      const options = threadId ? { message_thread_id: threadId } : {};
      await bot.telegram.sendMessage(chatId, text, options);
      results.sent.push({ chatId, name, topic: topicName });
    } catch (error) {
      console.error(
        `Broadcast failed for ${name} → ${topicName} (${chatId}):`,
        error.response?.description || error.message
      );
      results.failed.push({ chatId, name, topic: topicName, error: error.response?.description || error.message });
    }
    await sleep(50);
  }
}

    console.log(`Broadcast complete: ${results.sent.length} sent, ${results.failed.length} failed.`);
    if (results.failed.length) console.log("Failed chat IDs:", results.failed);
  });

  return router;
};