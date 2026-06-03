const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
require("dotenv").config();

console.log("Starting bot...");

const token = process.env.BOT_TOKEN;

const bot = new Telegraf(token);

bot.start((ctx) => {
  const firstname = ctx.message.chat.first_name;
  const firstmessage = `Hello ${firstname} 👋 ,
Welcome to JBC Support Bot.

I’m here to help you with common questions, account issues, transactions, wallet support, and more.

Please describe your issue or choose an option below to get started. 🚀
`;
  ctx.reply(
    firstmessage,
    Markup.inlineKeyboard([
      [Markup.button.callback("📘 Token & Conversion", "token_menu")],
      [Markup.button.callback("🏆 Rewards & Scores", "reward_menu")],
      [Markup.button.callback("💰 Staking & Vesting", "staking_menu")],
      [Markup.button.callback("🛠 Wallet & Technical Help", "wallet_menu")],
      [Markup.button.callback("📱 App & Platform Access", "app_menu")],
      [Markup.button.callback("🔐 Privacy & Account Deletion", "privacy_menu")],
      [Markup.button.callback("📞 Contact Support", "support_menu")],
    ]),
  );
});

bot.action("token_menu", async (ctx) => {
  await ctx.answerCbQuery();

  ctx.reply(
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
  await ctx.answerCbQuery();

  ctx.reply(
    "🏆 Rewards & Scores",
    Markup.inlineKeyboard([
      [Markup.button.callback("Trust Score", "trust_score")],
      [Markup.button.callback("DAO Score", "dao_score")],
      [Markup.button.callback("DAO Score vs Trust Score", "dao_vs_trust")],
      [Markup.button.callback("Rewards", "rewards")],
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
    await ctx.answerCbQuery();
    ctx.reply(
    "💰 Staking & Vesting",
    Markup.inlineKeyboard([
      [Markup.button.callback("What is staking?", "staking")],
      [Markup.button.callback("What is vesting?", "vesting")],
      [Markup.button.callback("Difference", "staking_vs_vesting")],
      [Markup.button.callback("What is veJBC?", "veJBC")],
      [Markup.button.callback("What is JBCv2?", "JBCv2")],
      [Markup.button.callback("veJBC vs JBCv2", "veJBC_vs_JBCv2")]
      [Markup.button.callback("Vesting completed", "vesting_completed")]
      [Markup.button.callback("Claiming", "claims")]    
      [Markup.button.callback("⬅ Back", "main_menu")],
    ]),
  );
})
bot.action("staking", async (ctx) => {
  await ctx.answerCbQuery();
    ctx.reply(`Staking is the process of locking your crypto tokens in a platform or protocol for a specific period in order to earn rewards, incentives, or passive income. Your tokens remain yours, but they are temporarily locked while generating returns.`);
    });

bot.action("vesting", async (ctx) => {
  await ctx.answerCbQuery();
    ctx.reply(`Vesting is a system that releases tokens gradually over time instead of giving all tokens immediately. It is commonly used to prevent massive sell-offs and encourage long-term participation.`);
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
    ctx.reply(`You use veJBC for vesting. veJBC usually means “Vested Escrow JBC.” It represents JBC tokens that are locked or vested for a period and may provide governance power, rewards, or ecosystem benefits depending on the platform rules.`);
    });

bot.action("JBCv2", async (ctx) => {
  await ctx.answerCbQuery();
    ctx.reply(`You use JBCv2 for staking, JBCv2 refers to Version 2 of the JBC token or ecosystem upgrade. It may include improvements such as better smart contracts, enhanced utilities, upgraded tokenomics, or migration from an older version. `);
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
    ctx.reply(`Vesting is a system that releases tokens gradually over time instead of giving all tokens immediately. It is commonly used to prevent massive sell-offs and encourage long-term participation.`);
    });

bot.action("claims", async (ctx) => {
  await ctx.answerCbQuery();
    ctx.reply(`Vesting is a system that releases tokens gradually over time instead of giving all tokens immediately. It is commonly used to prevent massive sell-offs and encourage long-term participation.`);
    });

//Wallet & Technical Help Menu
bot.action("wallet_menu", async (ctx) => {
  await ctx.answerCbQuery();
    ctx.reply(
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

bot.action(`rewards_not_received`, async(ctx) => {
    await ctx.answerCbQuery();
    
    ctx.reply(`Possible reasons include:
Reward distribution is still processing.
Delays from the platform or smart contract.
Incorrect wallet address submission.
Rewards are scheduled for batch distribution.
You should verify your wallet address, check the task status, and contact the project support team if the delay continues.
`)
})

bot.command("help", (ctx) => {
  const helpMessage = `Here are some commands you can use:
- /start: Start the bot
- /help: Show this help message
- /account: Manage your account settings
- /question: Ask a question about the bot
`;
  ctx.reply(helpMessage);
});

// bot.command("question", (ctx) => {
//   const userQuestion = ctx.message.text.replace("/question", "").trim();
//   if (!userQuestion) {
//     ctx.reply(
//       "Please provide a question after the command. For example: /question How do I reset my password?",
//     );
//     return;
//   } else if (userQuestion && userQuestion.includes("account")) {
//     ctx.reply(
//       "we have a lot of resources to help you with account issues. Please visit our support page: https://jbc.com/support/account",
//     );
//     return;
//   }
// });
bot.launch();

console.log("Bot started successfully");
