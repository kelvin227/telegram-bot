const {
  searchKnowledge,
  findBestMatch,
} = require("./ai/knowledgeSearch");

const questions = [
  "should i have gas to convert my jbc tokens?",
  "Why was my old JBC deducted?",
  "I can't convert my old JBC",
  "What is the difference between DAO and Trust score?",
  "How does staking work?",
  "I forgot my wallet address",
  "Is the iPhone app available?",
  "What happens to my data when I delete my account?",
];

for (const question of questions) {
  console.log("\n--------------------------------");
  console.log("USER:", question);

  const result = findBestMatch(question);

  if (!result) {
    console.log("NO MATCH");
    continue;
  }

  console.log("MATCH:", result.question);
  console.log("CATEGORY:", result.categoryTitle);
  console.log("SCORE:", result.score);
  console.log("ANSWER:", result.answer);
}