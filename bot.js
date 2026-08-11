const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
const knowledgeBase = require("./knowledge.js");
const generateAIResponse = require("./ai/airesponder.js");
require("dotenv").config();

console.log("Starting bot...");

const token = process.env.BOT_TOKEN;

const bot = new Telegraf(token);
const activeTickets = new Map();
const adminReplyMode = new Map();
const activeConversations = new Map();

const ADMINS = [
  1261376105,
  // replace with your Telegram user ID
];



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

bot.start((ctx) => {
  const firstname = ctx.message.chat.first_name;
  console.log(ctx.message.chat.id);

  ctx.reply(
    `Hello ${firstname} 👋

Welcome to JBC Support Bot.

Please choose a category below.`,
    mainMenu(),
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
  ctx.reply(
    knowledgeBase.staking.veJBC.answer
  );
});

bot.action("JBCv2", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    knowledgeBase.staking.JBCv2.answer
  );
});

bot.action("veJBC_vs_JBCv2", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(knowledgeBase.staking.veJBC_vs_JBCv2.answer);
});

bot.action("vesting_completed", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    knowledgeBase.staking.vesting_completed.answer
  );
});

bot.action("claims", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    knowledgeBase.staking.claims.answer
  );
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

  ctx.reply(
    knowledgeBase.privacy.account_deletion_permanent.answer,
  );
});

bot.action("full_data_removal", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(
    knowledgeBase.privacy.full_data_removal.answer,
  );
});

bot.action("data_sharing", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(
    knowledgeBase.privacy.data_sharing.answer,
  );
});

//Support Menu
bot.action("support_menu", async (ctx) => {
  const userId = ctx.from.id;

  let ticket = activeTickets.get(userId);
  const existingTicket = activeTickets.get(userId);

  if (existingTicket) {
    return ctx.reply(
      `You already have an open ticket (#${existingTicket.ticketId}). Please continue chatting here.`,
    );
  }

  if (!ticket) {
    ticket = {
      ticketId: Date.now(),
      status: "open",
      assignedAdmin: null,
      createdAt: new Date(),
    };

    activeTickets.set(userId, ticket);
  }

  await ctx.reply(
    `📞 Support ticket opened.

Ticket ID: ${ticket.ticketId}

Please send your message.`,
  );
});

bot.on("text", async (ctx) => {
  const senderId = ctx.from.id;
  const message = ctx.message.text;

  // ==========================================
  // 1. ADMIN → USER SUPPORT MESSAGE
  // ==========================================

  if (ADMINS.includes(senderId)) {
    if (activeConversations.has(senderId)) {
      const targetUser = activeConversations.get(senderId);

      await bot.telegram.sendMessage(
        targetUser,
        `📞 Support\n\n${message}`
      );

      await ctx.reply("✅ Reply sent.");
      return;
    }
  }

  // ==========================================
  // 2. USER → HUMAN SUPPORT
  // ==========================================

  const ticket = activeTickets.get(senderId);

  if (ticket && ticket.status === "open") {
    const supportGroupId = process.env.SUPPORT_GROUP_ID;

    await bot.telegram.sendMessage(
      supportGroupId,
      `
📩 User Reply

Ticket #${ticket.ticketId}

User: ${ctx.from.first_name}
ID: ${senderId}

${message}
`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: ticket.assignedAdmin
                  ? "👤 Assigned"
                  : "Reply",
                callback_data: `reply_${senderId}`,
              },
            ],
          ],
        },
      }
    );

    await ctx.reply("✅ Message sent to support.");

    return;
  }

  // ==========================================
  // 3. AI SUPPORT
  // ==========================================

  try {
    // Tell the user we're processing the question
    await ctx.sendChatAction("typing");

    const result = await generateAIResponse(message);

    await ctx.reply(result.answer);

  } catch (error) {
    console.error("AI handler error:", error);

    await ctx.reply(
      "Sorry, I couldn't process your question right now. Please try again or contact human support."
    );
  }
});

//detect messsages from the suppport group

bot.action(/reply_(.+)/, async (ctx) => {
  const adminId = ctx.from.id;

  if (!ADMINS.includes(adminId)) {
    return ctx.answerCbQuery("Unauthorized");
  }

  const userId = Number(ctx.match[1]);

  const ticket = activeTickets.get(userId);

  if (!ticket) {
    return ctx.answerCbQuery("Ticket not found");
  }

  if (ticket.assignedAdmin && ticket.assignedAdmin !== adminId) {
    return ctx.answerCbQuery("Ticket already assigned");
  }

  ticket.assignedAdmin = adminId;

  activeTickets.set(userId, ticket);
  activeConversations.set(adminId, userId);

  // adminReplyMode.set(adminId, userId);

  await ctx.editMessageReplyMarkup({
    inline_keyboard: [
      [
        {
          text: `👤 Assigned to ${ctx.from.first_name}`,
          callback_data: "assigned",
        },
      ],
      [
        {
          text: "🔒 Close Ticket",
          callback_data: `close_${userId}`,
        },
      ],
    ],
  });

  await ctx.reply(
    `You are now handling Ticket #${ticket.ticketId}

Send your reply.`,
  );
});

bot.action(/close_(.+)/, async (ctx) => {
  const adminId = ctx.from.id;

  if (ticket.assignedAdmin !== adminId) {
    return ctx.answerCbQuery("Only the assigned admin can close this ticket.");
  }

  if (!ADMINS.includes(adminId)) {
    return ctx.answerCbQuery("Unauthorized");
  }

  const userId = Number(ctx.match[1]);

  const ticket = activeTickets.get(userId);

  if (!ticket) {
    return ctx.answerCbQuery("Ticket already closed");
  }

  activeConversations.delete(ticket.assignedAdmin);

  activeTickets.delete(userId);

  await bot.telegram.sendMessage(
    userId,
    `✅ Your support ticket #${ticket.ticketId} has been closed.

If you need further assistance, simply open a new support request.`,
  );

  await ctx.reply(`🔒 Ticket #${ticket.ticketId} closed successfully.`);
});

bot.command("stopreply", async (ctx) => {
  activeConversations.delete(ctx.from.id);

  await ctx.reply("You have exited the current conversation.");
});

bot.launch();

console.log("Bot started successfully");
