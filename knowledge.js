const knowledgeBase = {
  token: {
    title: "📘 Token & Conversion",

    bnb_conversion: {
      question: "Do I need BNB for conversion?",
      keywords: ["bnb", "gas", "conversion", "convert", "fee"],
      answer: `Yes. You need a small amount of BNB in your wallet to pay for gas fees when performing transactions on the BNB Smart Chain (BEP-20) network.

⚠️ Make sure your wallet has enough BNB before starting the conversion. A zero BNB balance may prevent the transaction from being completed.`,
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
      answer: `If you are unable to convert OLDJBC, check the following:

1. 🌐 Make sure your internet connection is stable.
2. 👛 Make sure your wallet is connected properly.
3. 🔓 Make sure the tokens you want to convert are unlocked.
4. ⛽ Make sure your wallet has enough BNB to cover the gas fees.

⚠️ IMPORTANT: Starting from February, only 10% of tokens unlock monthly.

If the problem continues after checking these requirements, please contact our support team.

[SUPPORT PLACEHOLDER — add the appropriate support instructions here later.]`,
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

⚠️ Important:

🔸 **Trust Score**
Converting to veJBC may lower your Trust Score.

🔸 **Vesting Cancellation**
If you cancel a vesting process before it is completed, **all veJBC involved will be permanently lost.**

🔸 **No Recovery**
Cancelled vesting transactions **cannot be recovered.**

❗ Please review the vesting details carefully before proceeding.`,
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

After starting a vesting process, your JBCV2 tokens will only become claimable **after the selected vesting duration has been completed.**

⏳ Please wait until your chosen vesting period ends before attempting to claim your JBCV2.

[SUPPORT PLACEHOLDER — add the appropriate support instructions here later.]`,
    },
  },

  rewards: {
    title: "🏆 Rewards & Scores",

    trust_score: {
      question: "What is the Trust Score?",
      keywords: ["trust score", "trust", "loyalty score", "reward score"],
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
      keywords: ["dao score", "dao", "governance score", "voting score"],
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
        "jbc staking",
        "staking jbc",
        "lock jbc",
      ],
      answer: `JBC staking is part of the ecosystem's migration and rewards system.

Our platform is currently transitioning from the older smart contract. Users can deposit their old tokens into the migration/staking smart contract and lock them for a selected period.

🔒 Available lock periods:
• 3 months — 10% yield
• 6 months — 18% yield
• 1 year — 40% yield
• 2 years — 65% yield
• 3 years — 90% yield

During the selected lock period, users participate in the ecosystem's staking mechanism and receive ecosystem rewards points and the upgraded tokens according to the platform's distribution rules.

⚠️ The selected lock period determines the applicable yield, so users should carefully review the available options before starting a staking process.`,
    },

    vesting: {
      question: "What is vesting?",
      keywords: [
        "vesting",
        "vest",
        "vested",
        "how does vesting work",
        "jbc vesting",
        "vesting jbc",
        "token vesting",
        "vesting period",
      ],
      answer: `Vesting is the mechanism used by the JBC ecosystem to control when upgraded tokens become available to the user.

In the current JBC transition, users interact with the migration/staking system by depositing their older tokens into the designated smart contract. The user then selects a lock period.

🔒 Available lock periods:
• 3 months — 10% yield
• 6 months — 18% yield
• 1 year — 40% yield
• 2 years — 65% yield
• 3 years — 90% yield

⏳ The selected period is time-locked. Users must wait until the selected vesting/lock duration has been completed before the corresponding tokens become claimable according to the platform's distribution rules.

🏆 During this process, users can receive ecosystem rewards points and participate in the distribution of the upgraded JBCv2 tokens.

Important distinction:

• JBC is the active cryptocurrency.
• veJBC is an internal virtual counter used by the application to track loyalty and distribution schedules.
• JBCv2 is the upgraded cryptocurrency token.

⚠️ Before starting a vesting process, users should carefully check the selected duration and associated yield because the selected lock period determines the applicable staking terms.`,
    },

    staking_vs_vesting: {
      question: "What is the difference between staking and vesting?",
      keywords: [
        "staking vs vesting",
        "difference staking vesting",
        "staking and vesting",
        "difference between staking and vesting",
        "staking or vesting",
      ],
      answer: `Staking and vesting are related to the JBC ecosystem's migration and token distribution process, but they describe different aspects of the system.

🔒 STAKING
• Users deposit older tokens into the migration/staking smart contract.
• Users select a predefined lock period.
• Available periods are 3 months, 6 months, 1 year, 2 years, and 3 years.
• The corresponding yields are 10%, 18%, 40%, 65%, and 90%.
• Users participate in the ecosystem rewards and upgraded token distribution mechanism.

⏳ VESTING
• Vesting determines when the corresponding upgraded tokens become available to the user.
• The selected duration is time-locked.
• Users must wait until the selected period is completed before claiming tokens according to the platform's distribution rules.

💡 In simple terms:
Staking is the process of depositing and locking tokens through the migration/staking mechanism.

Vesting refers to the time-based release and claimability of the upgraded tokens.

⚠️ veJBC is separate from both concepts. It is an internal, off-chain virtual counter used by the application for loyalty and distribution calculations.`,
    },

    veJBC: {
      question: "What is veJBC?",
      keywords: [
        "vejbc",
        "what is vejbc",
        "vested jbc",
        "ve jbc",
        "vejbc token",
        "vejbc cryptocurrency",
        "vejbc value",
      ],
      answer: `veJBC is a virtual, off-chain loyalty and distribution counter used inside the JBC application.

⚠️ Important: veJBC is NOT a cryptocurrency.

veJBC:
• Exists only inside the application database.
• Is not recorded as a cryptocurrency on the blockchain.
• Cannot be transferred between wallets.
• Cannot be traded or sold on an exchange.
• Has no independent market value or financial value.
• Has no independent market pairs.

The application uses veJBC as a non-financial virtual counter to calculate user loyalty and help determine distribution schedules within the ecosystem.

💡 JBC is the active cryptocurrency. veJBC should not be treated as a separate tradable cryptocurrency or financial asset.`,
    },

    JBCv2: {
      question: "What is JBCv2?",
      keywords: [
        "jbcv2",
        "jbc v2",
        "jbc version 2",
        "version 2",
        "new jbc",
        "upgraded jbc",
        "jbcv2 token",
        "jbcv2 contract",
      ],
      answer: `JBCv2 is the upgraded JBC cryptocurrency token used as part of the ecosystem's transition from the older smart contract.

The JBC platform currently provides a migration/staking mechanism where users can deposit their older tokens into the designated smart contract and participate in a time-locked staking process.

🔒 Available lock periods:
• 3 months — 10% yield
• 6 months — 18% yield
• 1 year — 40% yield
• 2 years — 65% yield
• 3 years — 90% yield

Users receive ecosystem rewards points and the upgraded tokens according to the applicable distribution rules and selected lock period.

📋 JBCv2 Contract Address:
0x73cb7463fB02eF2bA258286356E2F45f250F85C9

⚠️ Always verify that you are interacting with the official JBCv2 contract address before performing a blockchain transaction.`,
    },

    veJBC_vs_JBCv2: {
      question: "veJBC vs JBCv2",
      keywords: [
        "vejbc vs jbcv2",
        "difference vejbc jbcv2",
        "vejbc and jbcv2",
        "difference between vejbc and jbcv2",
        "is vejbc a token",
        "is vejbc cryptocurrency",
        "jbcv2 vs vejbc",
      ],
      answer: `veJBC and JBCv2 are fundamentally different.

🟣 veJBC
• veJBC is NOT a cryptocurrency.
• It is a virtual, off-chain counter maintained inside the JBC application.
• It is used to track user loyalty and help calculate distribution schedules.
• It does not exist as a tradable cryptocurrency on the blockchain.
• It cannot be transferred or traded.
• It has no independent market value or financial value.
• It has no independent exchange market pair.

🟢 JBCv2
• JBCv2 is the upgraded JBC cryptocurrency.
• It is part of the ecosystem's transition from the older smart contract.
• It is associated with the migration/staking mechanism used by the platform.
• Users can participate in the time-locked migration/staking process to receive the upgraded tokens according to the applicable distribution rules.

📋 JBCv2 Contract Address:
0x73cb7463fB02eF2bA258286356E2F45f250F85C9

🔑 The simplest way to remember the difference:

veJBC = internal application counter for loyalty and distribution calculations.

JBCv2 = actual upgraded JBC cryptocurrency.

⚠️ Do not treat veJBC as a tradable cryptocurrency or attempt to look for veJBC exchange pairs.`,
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
      keywords: ["claim", "claiming", "claim tokens", "claim jbc"],
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
      keywords: ["ios", "iphone app", "ios app", "apple app", "testflight"],
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
