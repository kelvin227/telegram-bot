const knowledgeBase = {
  token: {
    title: "📘 Token & Conversion",

    bnb_conversion: {
      question: "Do I need BNB for conversion?",
      keywords: [
        "bnb",
        "gas",
        "conversion",
        "convert",
        "fee",
      ],
      answer: `Yes. You must have a small amount of BNB in your wallet to cover blockchain gas fees during the conversion process.`,
    },

    missing_vejbc: {
      question: "OLDJBC deducted but no veJBC",
      keywords: [
        "oldjbc deducted",
        "oldjbc missing",
        "missing vejbc",
        "no vejbc",
        "vejbc not received",
        "conversion deducted",
      ],
      answer: `This may happen due to temporary synchronization delays between the wallet and the system.

✅ Your balance is usually restored or reflected automatically within 24–48 hours.

⚠️ In some cases, manual proof may be requested by the support team.`,
    },

    unable_convert: {
      question: "Unable to convert OLDJBC",
      keywords: [
        "cannot convert",
        "can't convert",
        "unable to convert",
        "conversion failed",
        "oldjbc conversion",
      ],
      answer: `Please check the following before trying again:

• Your internet connection is stable
• Your wallet is connected properly
• The tokens you want to send are unlocked
• You have enough BNB for gas fees

📌 Note: Starting from February, only 10% of tokens unlock monthly.`,
    },

    convert_v2: {
      question: "Convert veJBC to JBCV2",
      keywords: [
        "convert vejbc",
        "vejbc to jbcv2",
        "convert to jbcv2",
        "jbcv2 conversion",
      ],
      answer: `You must use the Vesting System available in the app.

⚠️ Important Warning:

Converting to veJBC may lower your Trust Score.

If you cancel a vesting process before completion, all veJBC involved will be permanently lost.

Cancelled vesting transactions cannot be recovered.

Please proceed carefully, as all responsibility belongs to the user.`,
    },

    missing_v2: {
      question: "Why can't I see JBCV2?",
      keywords: [
        "jbcv2 missing",
        "can't see jbcv2",
        "cannot see jbcv2",
        "where is jbcv2",
        "jbcv2 not showing",
      ],
      answer: `JBCV2 distribution has not started yet.

After starting a vesting process, you must wait until the selected vesting period is completed before claiming your JBCV2 tokens.`,
    },
  },

  rewards: {
    title: "🏆 Rewards & Scores",

    trust_score: {
      question: "What is the Trust Score?",
      keywords: [
        "trust score",
        "trust",
        "loyalty score",
        "reward score",
      ],
      answer: `The Trust Score measures your loyalty and activity within the JBC ecosystem.

It is calculated based on:

• Profile completion
• Task participation
• Approved tasks
• Vesting/Staking activity
• DAO participation

🎁 Users with higher Trust Scores receive better reward percentages.`,
    },

    dao_score: {
      question: "What is the DAO Score?",
      keywords: [
        "dao score",
        "dao",
        "governance score",
        "voting score",
      ],
      answer: `The DAO Score represents your governance power in the JBC ecosystem.

It allows users to:

• Vote on ecosystem decisions
• Participate in governance activities
• Influence future system updates

📈 Higher DAO Scores mean stronger voting influence.`,
    },

    dao_vs_trust: {
      question: "DAO Score vs Trust Score",
      keywords: [
        "dao vs trust",
        "difference between dao and trust",
        "trust score vs dao",
        "difference in scores",
      ],
      answer: `DAO Score vs Trust Score:

DAO Score focuses on governance and voting rights.

Trust Score focuses on rewards and earnings.

DAO Score measures ecosystem participation.

Trust Score measures loyalty and engagement.

✅ Both scores positively affect your ecosystem ranking.`,
    },

    rewards: {
      question: "What rewards can I earn from tasks?",
      keywords: [
        "rewards",
        "task rewards",
        "earn from tasks",
        "what can i earn",
        "airdrop",
        "usdt rewards",
      ],
      answer: `Users can earn:

• Airdrops
• USDT
• Other ecosystem rewards

You can:

• Convert rewards into veJBC
• Withdraw USDT to your wallet
• Receive airdrops automatically`,
    },

    withdraw: {
      question: "Withdraw Feature",
      keywords: [
        "withdraw",
        "withdrawal",
        "withdraw usdt",
        "withdraw rewards",
        "cash out",
      ],
      answer: `The Withdraw section allows you to transfer your earned USDT rewards to your personal wallet.

📌 Withdrawal requests are only available on specific dates announced by the platform.

⚠️ Please ensure you have a compatible wallet connected to receive your rewards.`,
    },
  },

  staking: {
    title: "💰 Staking & Vesting",

    staking: {
      question: "What is staking?",
      keywords: [
        "staking",
        "stake",
        "staked",
        "how does staking work",
      ],
      answer: `Staking is the process of locking your crypto tokens in a platform or protocol for a specific period in order to earn rewards, incentives, or passive income.

Your tokens remain yours, but they are temporarily locked while generating returns.`,
    },

    vesting: {
      question: "What is vesting?",
      keywords: [
        "vesting",
        "vest",
        "vested",
        "how does vesting work",
      ],
      answer: `Vesting is a system that releases tokens gradually over time instead of giving all tokens immediately.

It is commonly used to prevent massive sell-offs and encourage long-term participation.`,
    },

    staking_vs_vesting: {
      question: "What is the difference between staking and vesting?",
      keywords: [
        "staking vs vesting",
        "difference staking vesting",
        "staking and vesting",
        "difference between staking and vesting",
      ],
      answer: `Staking is mainly for earning rewards by locking tokens.

Vesting is mainly for controlled token distribution over a scheduled period.

In staking, you lock tokens voluntarily to earn benefits.

In vesting, tokens are released according to predefined rules or timelines.`,
    },

    veJBC: {
      question: "What is veJBC?",
      keywords: [
        "vejbc",
        "what is vejbc",
        "vested jbc",
        "vested escrow jbc",
      ],
      answer: `You use veJBC for vesting.

veJBC usually means “Vested Escrow JBC.” It represents JBC tokens that are locked or vested for a period and may provide governance power, rewards, or ecosystem benefits depending on the platform rules.`,
    },

    JBCv2: {
      question: "What is JBCv2?",
      keywords: [
        "jbcv2",
        "jbc v2",
        "version 2",
        "new jbc",
      ],
      answer: `JBCv2 refers to Version 2 of the JBC token or ecosystem upgrade.

It may include improvements such as better smart contracts, enhanced utilities, upgraded tokenomics, or migration from an older version.`,
    },

    veJBC_vs_JBCv2: {
      question: "veJBC vs JBCv2",
      keywords: [
        "vejbc vs jbcv2",
        "difference vejbc jbcv2",
        "vejbc and jbcv2",
      ],
      answer: `veJBC is a vested/locked representation of JBC used for rewards, governance, or long-term participation.

JBCv2 is the upgraded version of the actual JBC token or protocol system.

veJBC focuses on token locking and benefits, while JBCv2 focuses on the upgraded ecosystem/token structure.`,
    },

    vesting_completed: {
      question: "Vesting completed",
      keywords: [
        "vesting completed",
        "vesting finished",
        "vesting ended",
        "completed vesting",
      ],
      answer: `Vesting is a system that releases tokens gradually over time instead of giving all tokens immediately.

It is commonly used to prevent massive sell-offs and encourage long-term participation.`,
    },

    claims: {
      question: "Claiming",
      keywords: [
        "claim",
        "claiming",
        "claim tokens",
        "claim jbc",
      ],
      answer: `Vesting is a system that releases tokens gradually over time instead of giving all tokens immediately.

It is commonly used to prevent massive sell-offs and encourage long-term participation.`,
    },
  },

  wallet: {
    title: "🛠 Wallet & Technical Help",

    wrong_wallet: {
      question: "Wrong Wallet Address",
      keywords: [
        "wrong wallet",
        "wrong address",
        "incorrect wallet",
        "change wallet",
        "wallet correction",
      ],
      answer: `You must contact the admin/support team.

📅 Wallet correction requests are reviewed every Friday.

⚠️ Important:

• Wallet updates are allowed only once per user
• If rewards or balances already exist, changes may not be approved for security reasons`,
    },

    handshake_error: {
      question: "HANDSHAKE Error",
      keywords: [
        "handshake",
        "handshake error",
        "profile error",
        "email formatting",
      ],
      answer: `This error usually occurs because of incorrect profile or email formatting.

✅ Please ensure:

• Your email is entered correctly
• No extra spaces are added
• All fields are completed properly`,
    },

    contract_wallet: {
      question: "Contract vs Wallet address",
      keywords: [
        "contract address",
        "wallet address",
        "difference contract wallet",
        "bscscan contract",
      ],
      answer: `A BSC wallet address belongs to a user and is used for sending/receiving tokens.

A contract address belongs to a smart contract and controls token operations or decentralized applications.

Both usually start with “0x”.

You can identify them by checking on BscScan:

• Wallet addresses show normal wallet activity.
• Contract addresses show “Contract” labels and smart contract details.`,
    },

    bsc_address: {
      question: "Why BSC address is required",
      keywords: [
        "bsc address",
        "bnb smart chain address",
        "why bsc",
        "jbc wallet address",
        "registration wallet",
      ],
      answer: `Because JBC operates on the BNB Smart Chain network, rewards and transactions are distributed through a compatible BSC wallet address.

The BSC address ensures proper receipt of tokens, rewards, and ecosystem interactions.`,
    },

    rewards_not_received: {
      question: "Rewards not received",
      keywords: [
        "rewards not received",
        "reward missing",
        "where are my rewards",
        "reward not showing",
        "haven't received rewards",
      ],
      answer: `Possible reasons include:

• Reward distribution is still processing.
• Delays from the platform or smart contract.
• Incorrect wallet address submission.
• Rewards are scheduled for batch distribution.

You should verify your wallet address, check the task status, and contact the project support team if the delay continues.`,
    },
  },

  app: {
    title: "📱 App & Platform Access",

    ios_app: {
      question: "Is the iOS app available?",
      keywords: [
        "ios",
        "iphone app",
        "ios app",
        "apple app",
        "testflight",
      ],
      answer: `Yes, the iOS app is currently under approval and will be available soon.

🍎 Until release, iPhone users can continue using the platform smoothly through the Safari browser or joining the iOS test group.`,
      action: "testflight",
    },
  },

  privacy: {
    title: "🔐 Privacy & Account Deletion",

    data_retention: {
      question: "How long do you retain user data after account deletion?",
      keywords: [
        "data retention",
        "how long data kept",
        "account deletion data",
        "delete account",
        "data after deletion",
      ],
      answer: `To avoid any issues or errors after an account deletion request, we give the user 7 business days.

The deletion process will then be completed and all data will be permanently deleted after this period.`,
    },

    data_retention_details: {
      question: "What personal information is kept after deletion?",
      keywords: [
        "personal information",
        "phone number after deletion",
        "email after deletion",
        "device data",
        "wallet information",
        "data kept after deletion",
      ],
      answer: `All personal information, including phone numbers, emails, device data, and wallet information, is permanently deleted after the 7-day retention period following an account deletion request.

No user data is retained beyond this period.`,
    },

    account_deletion_permanent: {
      question: "Is account deletion permanent?",
      keywords: [
        "permanent deletion",
        "delete permanently",
        "account deletion permanent",
        "can account be recovered",
      ],
      answer: `Yes, account deletion is permanent.

Once the 7-day retention period is over and the account is deleted, all user data is permanently removed from our systems and cannot be recovered.`,
    },

    full_data_removal: {
      question: "Can users request full removal of personal data?",
      keywords: [
        "remove personal data",
        "full data removal",
        "delete personal information",
        "remove all data",
      ],
      answer: `Yes, users can request full removal of their personal data by submitting an account deletion request through Telegram or by contacting our support team directly.

Once the request is processed, all personal data will be permanently deleted after the 7-day retention period.`,
    },

    data_sharing: {
      question: "Do you share user data with third parties?",
      keywords: [
        "data sharing",
        "third parties",
        "share my data",
        "user information",
        "privacy",
      ],
      answer: `This information is used solely for notification purposes and account verification purposes.

It is not shared with anyone else.`,
    },
  },
};

module.exports = knowledgeBase;