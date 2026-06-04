const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
require("dotenv").config();

console.log("Starting bot...");

const token = process.env.BOT_TOKEN;


const bot = new Telegraf(token);
const supportSessions = new Map();
const awaitingSupportMessage = new Set();
const adminReplyMode = new Map();


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

  ctx.reply(`
Yes. You must have a small amount of BNB in your wallet to cover blockchain gas fees during the conversion process.
  `);
});

bot.action("missing_vejbc", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(`
This may happen due to temporary synchronization delays between the wallet and the system.
✅ Your balance is usually restored or reflected automatically within 24–48 hours.
⚠️ In some cases, manual proof may be requested by the support team.

  `);
});

bot.action("unable_convert", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(`
Please check the following before trying again:
Your internet connection is stable
Your wallet is connected properly
The tokens you want to send are unlocked
You have enough BNB for gas fees
📌 Note: Starting from February, only 10% of tokens unlock monthly.

  `);
});

bot.action("convert_v2", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(`
        You must use the Vesting System available in the app.
⚠️ Important Warning:
Converting to veJBC may lower your Trust Score
If you cancel a vesting process before completion, all veJBC involved will be permanently lost
Cancelled vesting transactions cannot be recovered
Please proceed carefully, as all responsibility belongs to the user.
    `);
});

bot.action("missing_v2", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(`JBCV2 distribution has not started yet.
After starting a vesting process, you must wait until the selected vesting period is completed before claiming your JBCV2 tokens.

    `);
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

  ctx.reply(`
    What is the Trust Score?
    The Trust Score measures your loyalty and activity within the JBC ecosystem.
It is calculated based on:
Profile completion
Task participation
Approved tasks
Vesting/Staking activity
DAO participation
🎁 Users with higher Trust Scores receive better reward percentages.

    `);
});

bot.action("dao_score", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(`What is the DAO Score?
The DAO Score represents your governance power in the JBC ecosystem.
It allows users to:
Vote on ecosystem decisions
Participate in governance activities
Influence future system updates
📈 Higher DAO Scores mean stronger voting influence.`);
});

bot.action("dao_vs_trust", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(`DAO Score vs Trust Score:
        DAO Score	Trust Score
Focuses on governance and voting rights	Focuses on rewards and earnings
Measures ecosystem participation	Measures loyalty and engagement
✅ Both scores positively affect your ecosystem ranking.
    `);
});

bot.action("rewards", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(`What rewards can I earn from tasks?
Users can earn:
Airdrops
USDT
Other ecosystem rewards
You can:
Convert rewards into veJBC
Withdraw USDT to your wallet
Receive airdrops automatically
`);
});

bot.action("withdraw", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(`
        The Withdraw section allows you to transfer your earned USDT rewards to your personal wallet.
📌 Withdrawal requests are only available on specific dates announced by the platform.
⚠️ Please ensure you have a compatible wallet connected to receive your rewards.
    `);
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
      [
        Markup.button.callback("⬅ Back", "main_menu")
      ],
    ]),
  );
});
bot.action("staking", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    `Staking is the process of locking your crypto tokens in a platform or protocol for a specific period in order to earn rewards, incentives, or passive income. Your tokens remain yours, but they are temporarily locked while generating returns.`,
  );
});

bot.action("vesting", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    `Vesting is a system that releases tokens gradually over time instead of giving all tokens immediately. It is commonly used to prevent massive sell-offs and encourage long-term participation.`,
  );
});

bot.action("staking_vs_vesting", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(`Staking is mainly for earning rewards by locking tokens.
Vesting is mainly for controlled token distribution over a scheduled period.
In staking, you lock tokens voluntarily to earn benefits.
In vesting, tokens are released according to predefined rules or timelines.
`);
});

bot.action("veJBC", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    `You use veJBC for vesting. veJBC usually means “Vested Escrow JBC.” It represents JBC tokens that are locked or vested for a period and may provide governance power, rewards, or ecosystem benefits depending on the platform rules.`,
  );
});

bot.action("JBCv2", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    `You use JBCv2 for staking, JBCv2 refers to Version 2 of the JBC token or ecosystem upgrade. It may include improvements such as better smart contracts, enhanced utilities, upgraded tokenomics, or migration from an older version. `,
  );
});

bot.action("veJBC_vs_JBCv2", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(`veJBC is a vested/locked representation of JBC used for rewards, governance, or long-term participation.
JBCv2 is the upgraded version of the actual JBC token or protocol system.
veJBC focuses on token locking and benefits, while JBCv2 focuses on the upgraded ecosystem/token structure.
`);
});

bot.action("vesting_completed", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    `Vesting is a system that releases tokens gradually over time instead of giving all tokens immediately. It is commonly used to prevent massive sell-offs and encourage long-term participation.`,
  );
});

bot.action("claims", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(
    `Vesting is a system that releases tokens gradually over time instead of giving all tokens immediately. It is commonly used to prevent massive sell-offs and encourage long-term participation.`,
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
  ctx.reply(`I entered the wrong wallet address. How can I fix it?
You must contact the admin/support team.
📅 Wallet correction requests are reviewed every Friday.
⚠️ Important:
Wallet updates are allowed only once per user
If rewards or balances already exist, changes may not be approved for security reasons
`);
});

bot.action("handshake_error", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(`What is a HANDSHAKE error and how do I fix it?
This error usually occurs because of incorrect profile or email formatting.
✅ Please ensure:
Your email is entered correctly
No extra spaces are added
All fields are completed properly
`);
});

bot.action("contract_wallet", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(`How can I differentiate between a contract address and BSC wallet address?
A BSC wallet address belongs to a user and is used for sending/receiving tokens.
A contract address belongs to a smart contract and controls token operations or decentralized applications.
Both usually start with “0x”, but you can identify them by checking on BscScan⁠ :
Wallet addresses show normal wallet activity.
Contract addresses show “Contract” labels and smart contract details.
`);
});

bot.action("bsc_address", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(`Why is BNB Smart Chain address requested for registration instead of JBC wallet address?
Because JBC operates on the BNB Smart Chain network, rewards and transactions are distributed through a compatible BSC wallet address. The BSC address ensures proper receipt of tokens, rewards, and ecosystem interactions.
`);
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
    `Yes, the iOS app is currently under approval and will be available soon.
🍎 Until release, iPhone users can continue using the platform smoothly through the Safari browser or joining the ios test group.
`,
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

  ctx.reply(`To avoid any issues or errors after an account deletion request, we give the user 7 business days. the deletion process will then be completed and all data will be permanently deleted after this period.`);
});

bot.action("data_retention_details", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(`All personal information, including phone numbers, emails, device data, and wallet information, is permanently deleted after the 7-day retention period following an account deletion request. No user data is retained beyond this period.`);
});

bot.action("account_deletion_permanent", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(`Yes, account deletion is permanent. Once the 7-day retention period is over and the account is deleted, all user data is permanently removed from our systems and cannot be recovered.`);
});

bot.action("full_data_removal", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(`Yes, users can request full removal of their personal data by submitting an account deletion request throught telegram or by contacting our support team directly. Once the request is processed, all personal data will be permanently deleted after the 7-day retention period.`);
});

bot.action("data_sharing", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(`This information is used solely for notification purposes and account verification purposes. it is not shared with anyone else.`);
});

//Support Menu
bot.action("support_menu", async (ctx) => {
  const userId = ctx.from.id;

  supportSessions.set(userId, {
    username: ctx.from.username,
    startedAt: new Date(),
  });

  awaitingSupportMessage.add(userId);

  await ctx.reply(
    "Please send your support message. A human agent will respond shortly."
  );
});

bot.on("text", async (ctx) => {
  const userId = ctx.from.id;

  // Admin reply mode
  if (adminReplyMode.has(userId)) {
    const targetUser = adminReplyMode.get(userId);

    adminReplyMode.delete(userId);

    await bot.telegram.sendMessage(
      targetUser,
      `📞 Support Response\n\n${ctx.message.text}`
    );

    await ctx.reply("✅ Response sent successfully.");

    return;
  }

  // User support mode
  if (awaitingSupportMessage.has(userId)) {
    awaitingSupportMessage.delete(userId);

    const supportGroupId = process.env.SUPPORT_GROUP_ID;

    await bot.telegram.sendMessage(
      supportGroupId,
      `🎫 New Support Ticket

User: ${ctx.from.first_name}
Username: @${ctx.from.username || "N/A"}
User ID: ${userId}

Message:
${ctx.message.text}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Reply",
                callback_data: `reply_${userId}`,
              },
            ],
          ],
        },
      }
    );

    await ctx.reply(
      "✅ Your message has been sent to our support team."
    );
  }
});

bot.action(/reply_(.+)/, async (ctx) => {
  const userId = ctx.match[1];

  adminReplyMode.set(ctx.from.id, userId);

  await ctx.reply(
    `Replying to user ${userId}\n\nSend your response.`
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

bot.launch();

console.log("Bot started successfully");
