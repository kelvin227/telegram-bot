const express = require("express");
const broadcastRoute = require("./routes/function.js");
const { Telegraf, Markup } = require("telegraf");
const detectSpam = require("./moderation/spamDetector.js");
const price = require("./routes/calls.js");
const extractMessageContent = require("./routes/extract.js");
const axios = require("axios");
const knowledgeBase = require("./knowledge.js");
const translateText = require("./ai/translate.js");
const generateAIResponse = require("./ai/airesponder.js");
require("dotenv").config();

console.log("Starting bot...");

const token = process.env.BOT_TOKEN;

const bot = new Telegraf(token);
const userLanguages = new Map();

async function navigate(ctx, text, keyboard) {
  await ctx.answerCbQuery();

  await ctx.editMessageText(text, {
    reply_markup: keyboard.reply_markup,
  });
}

function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("📘 Token & Conversion", "token_menu")],
    [Markup.button.callback("🏆 Rewards & Scores", "reward_menu")],
    [Markup.button.callback("💰 Staking & Vesting", "staking_menu")],
    [Markup.button.callback("🛠 Wallet & Technical Help", "wallet_menu")],
    [Markup.button.callback("📱 App & Platform Access", "app_menu")],
    [Markup.button.callback("🔐 Privacy & Account Deletion", "privacy_menu")],
    [Markup.button.callback("📞 Contact Support", "support_menu")],
  ]);
}
function languageMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("🇬🇧 English", "lang_en"),
      Markup.button.callback("🇪🇸 Español", "lang_es"),
    ],
    [Markup.button.callback("🇫🇷 Français", "lang_fr")],
  ]);
}

bot.start((ctx) => {
  const firstname = ctx.message.chat.first_name;
  console.log(ctx.message.chat.id);

  ctx.reply(
    `Hello ${firstname} 👋
    i am JBC support bot,
    how may i assit you
`,
  );
});

bot.command("help", (ctx) => {
  const helpMessage = `Here are some commands you can use:
- /start: Start the bot
- /help: Show this help message
- /account: Manage your account settings
- /question: Ask a question about the bot
`;
  ctx.reply(helpMessage);
});

bot.action("main_menu", async (ctx) => {
  await navigate(
    ctx,
    "Welcome to JBC Support Bot 🚀\n\nChoose a category below:",
    mainMenu(),
  );
});

bot.action("token_menu", async (ctx) => {
  await navigate(
    ctx,
    "📘 Token & Conversion FAQs",
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "Do I need BNB for conversion?",
          "bnb_conversion",
        ),
      ],
      [Markup.button.callback("OLDJBC deducted but no veJBC", "missing_vejbc")],
      [Markup.button.callback("Unable to convert OLDJBC", "unable_convert")],
      [Markup.button.callback("Convert veJBC to JBCV2", "convert_v2")],
      [Markup.button.callback("Why can't I see JBCV2?", "missing_v2")],
      [Markup.button.callback("⬅ Back", "main_menu")],
    ]),
  );
});

bot.action("bnb_conversion", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(knowledgeBase.token.bnb_conversion.answer);
});

bot.action("missing_vejbc", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(knowledgeBase.token.missing_vejbc.answer);
});

bot.action("unable_convert", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(knowledgeBase.token.unable_convert.answer);
});

bot.action("convert_v2", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(knowledgeBase.token.convert_v2.answer);
});

bot.action("missing_v2", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(knowledgeBase.token.missing_v2.answer);
});

//Rewards & Scores Menu
bot.action("reward_menu", async (ctx) => {
  await navigate(
    ctx,
    "🏆 Rewards & Scores",
    Markup.inlineKeyboard([
      [Markup.button.callback("What is the Trust Score?", "trust_score")],
      [Markup.button.callback("What is the DAO Score?", "dao_score")],
      [Markup.button.callback("DAO Score vs Trust Score", "dao_vs_trust")],
      [Markup.button.callback("What rewards can I earn?", "rewards")],
      [Markup.button.callback("Withdraw Feature", "withdraw")],
      [Markup.button.callback("⬅ Back", "main_menu")],
    ]),
  );
});

bot.action("trust_score", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(knowledgeBase.reward.trust_score.answer);
});

bot.action("dao_score", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(knowledgeBase.reward.dao_score.answer);
});

bot.action("dao_vs_trust", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(knowledgeBase.reward.dao_vs_trust.answer);
});

bot.action("rewards", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(knowledgeBase.reward.rewards.answer);
});

bot.action("withdraw", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(knowledgeBase.reward.withdraw.answer);
});

//staking & Vesting
bot.action("staking_menu", async (ctx) => {
  await navigate(
    ctx,
    "💰 Staking & Vesting",
    Markup.inlineKeyboard([
      [Markup.button.callback("What is staking?", "staking")],
      [Markup.button.callback("What is vesting?", "vesting")],
      [Markup.button.callback("Difference", "staking_vs_vesting")],
      [Markup.button.callback("What is veJBC?", "veJBC")],
      [Markup.button.callback("What is JBCv2?", "JBCv2")],
      [Markup.button.callback("veJBC vs JBCv2", "veJBC_vs_JBCv2")],
      [Markup.button.callback("Vesting completed", "vesting_completed")],
      [Markup.button.callback("Claiming", "claims")],
      [Markup.button.callback("⬅ Back", "main_menu")],
    ]),
  );
});
bot.action("staking", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(knowledgeBase.staking.staking.answer);
});

bot.action("vesting", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(knowledgeBase.staking.vesting.answer);
});

bot.action("staking_vs_vesting", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(knowledgeBase.staking.staking_vs_vesting.answer);
});

bot.action("veJBC", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(knowledgeBase.staking.veJBC.answer);
});

bot.action("JBCv2", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(knowledgeBase.staking.JBCv2.answer);
});

bot.action("veJBC_vs_JBCv2", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(knowledgeBase.staking.veJBC_vs_JBCv2.answer);
});

bot.action("vesting_completed", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(knowledgeBase.staking.vesting_completed.answer);
});

bot.action("claims", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(knowledgeBase.staking.claims.answer);
});

//Wallet & Technical Help Menu
bot.action("wallet_menu", async (ctx) => {
  await navigate(
    ctx,
    "🛠 Wallet & Technical Help",
    Markup.inlineKeyboard([
      [Markup.button.callback("Wrong Wallet Address", "wrong_wallet")],
      [Markup.button.callback("HANDSHAKE Error", "handshake_error")],
      [Markup.button.callback("Contract vs Wallet address", "contract_wallet")],
      [Markup.button.callback("Why BSC address is required", "bsc_address")],
      [Markup.button.callback("Rewards not received", "rewards_not_received")],
      [Markup.button.callback("⬅ Back", "main_menu")],
    ]),
  );
});

bot.action("wrong_wallet", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(knowledgeBase.wallet.wrong_wallet.answer);
});

bot.action("handshake_error", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(knowledgeBase.wallet.handshake_error.answer);
});

bot.action("contract_wallet", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(knowledgeBase.wallet.contract_wallet.answer);
});

bot.action("bsc_address", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(knowledgeBase.wallet.bsc_address.answer);
});

bot.action(`rewards_not_received`, async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(`Possible reasons include:
Reward distribution is still processing.
Delays from the platform or smart contract.
Incorrect wallet address submission.
Rewards are scheduled for batch distribution.
You should verify your wallet address, check the task status, and contact the project support team if the delay continues.
`);
});

//App & Platform Access Menu
bot.action("app_menu", async (ctx) => {
  await navigate(
    ctx,
    "📱 App & Platform Access",
    Markup.inlineKeyboard([
      [Markup.button.callback("Is the iOS app available?", "ios_app")],
      [Markup.button.callback("⬅ Back", "main_menu")],
    ]),
  );
});

bot.action(`ios_app`, async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(
    knowledgeBase.app.ios_app.answer,
    Markup.inlineKeyboard([
      [
        Markup.button.url(
          "Join iOS Test Group",
          "https://testflight.apple.com/join/FvsUb6C8",
        ),
      ],
    ]),
  );
});

bot.command(`price`, async (ctx) => {
  const chatType = ctx.chat.type;

  const isGroup = chatType === "group" || chatType === "supergroup";

  if (!isGroup) {
    console.log("not a group");
    return;
  }
  const username = ctx.message.from.username;

  const checkPrice = await price();

  ctx.reply(
    `@${username}
    JBC is currently selling for
    ${checkPrice} per token`,
  );
});

//Privacy & Account Deletion Menu
bot.action("privacy_menu", async (ctx) => {
  await navigate(
    ctx,
    "🔐 Privacy & Account Deletion",
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "How long do you retain user data after account deletion?",
          "data_retention",
        ),
      ],
      [
        Markup.button.callback(
          "What personal information is kept after deletion (phone number, email, device data, wallet information, etc.)?",
          "data_retention_details",
        ),
      ],
      [
        Markup.button.callback(
          "Is account deletion permanent?",
          "account_deletion_permanent",
        ),
      ],
      [
        Markup.button.callback(
          "Can users request full removal of personal data?",
          "full_data_removal",
        ),
      ],
      [
        Markup.button.callback(
          "Do you share user data with third parties?",
          "data_sharing",
        ),
      ],
      [Markup.button.callback("⬅ Back", "main_menu")],
    ]),
  );
});

bot.action("data_retention", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(knowledgeBase.privacy.data_retention.answer);
});

bot.action("data_retention_details", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(knowledgeBase.privacy.data_retention_details.answer);
});

bot.action("account_deletion_permanent", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(knowledgeBase.privacy.account_deletion_permanent.answer);
});

bot.action("full_data_removal", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(knowledgeBase.privacy.full_data_removal.answer);
});

bot.action("data_sharing", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(knowledgeBase.privacy.data_sharing.answer);
});

bot.on("message", async (ctx) => {
  const senderId = ctx.from.id;
  const message = extractMessageContent(ctx);
  const chatType = ctx.chat.type;
  const chatId = ctx.message.message_thread_id;
  const userLang = ctx.from.language_code || "en";

  console.log(chatId);

  console.log(message);
  console.log(ctx.message.sticker)
  console.log(ctx.message.text)

  console.log("Chat type:", chatType);

  // ==========================================
  // 1. CHECK IF THIS IS A GROUP
  // ==========================================
  const isGroup = chatType === "group" || chatType === "supergroup";

  if (isGroup) {
    const botUsername = ctx.botInfo.username;
    // ------------------------------------------
    // CHECK 1: Is the bot mentioned?
    // ------------------------------------------
    const isMentioned = message.includes(`@${botUsername}`);

    // ------------------------------------------
    // CHECK 2: Is the user replying to the bot?
    // ------------------------------------------
    const isReplyToBot =
      ctx.message.reply_to_message &&
      ctx.message.reply_to_message.from &&
      ctx.message.reply_to_message.from.id === ctx.botInfo.id;

    // Ignore normal group conversations
    if (!isMentioned && !isReplyToBot) {
      console.log("checking spam");
      const detect = detectSpam(message);

      console.log(detect.isSpam);

      if (detect.isSpam) {
        await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
        return;
      }
      return;
    }

    // ------------------------------------------
    // REMOVE BOT MENTION
    // ------------------------------------------
    const userMessage = isMentioned
      ? message.replace(new RegExp(`@${botUsername}`, "gi"), "").trim()
      : message.trim();

    // User mentioned the bot but didn't ask anything
    if (!userMessage) {
      return ctx.reply("👋 How can I help you?");
    }

    try {
      await ctx.sendChatAction("typing");

      const result = await generateAIResponse(userMessage);

      return ctx.reply(result.answer);
    } catch (error) {
      console.error("AI group handler error:", error);

      return ctx.reply(
        "Sorry, I couldn't process your question right now. Please try again.",
      );
    }
  }

  // ==========================================
  // 2. PRIVATE CHAT AI SUPPORT
  // ==========================================
  try {
    await ctx.sendChatAction("typing");
    const result = await generateAIResponse(message);
    let reply = result.answer;

    await ctx.reply(reply);
  } catch (error) {
    console.error("AI handler error:", error);

    await ctx.reply(
      "Sorry, I couldn't process your question right now. Please try again or contact human support.",
    );
  }
});

bot.launch();

console.log("Bot started successfully");

// ==========================================
// EXPRESS API SERVER (runs alongside the bot)
// ==========================================
const app = express();
app.use(express.json());

app.use("/api", broadcastRoute(bot)); // pass the same bot instance so it can send messages

const PORT = process.env.PORT || 3232;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

// Graceful shutdown — stops both the bot and lets any in-flight requests finish
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
