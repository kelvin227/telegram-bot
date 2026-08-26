const detectFlood = require("./moderation/floodDetector");

const userId = 12345;

for (let i = 1; i <= 7; i++) {
  const result = detectFlood(userId);

  console.log(`Message ${i}:`, result);
}