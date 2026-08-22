const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
require("dotenv").config();

const group = [-5079156156, /* ... rest of your group chat IDs */];

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

    for (const chatId of group) {
      try {
        await bot.telegram.sendMessage(chatId, text);
        results.sent.push(chatId);
      } catch (error) {
        console.error(
          `Broadcast failed for ${chatId}:`,
          error.response?.description || error.message
        );
        results.failed.push({ chatId, error: error.response?.description || error.message });
      }

      // Layer 2: Telegram caps ~30 messages/sec globally — this keeps you under that.
      await sleep(50);
    }

    console.log(`Broadcast complete: ${results.sent.length} sent, ${results.failed.length} failed.`);
    if (results.failed.length) console.log("Failed chat IDs:", results.failed);
  });

  return router;
};