const userMessages = new Map();

// Configuration
const MAX_MESSAGES = 5;
const TIME_WINDOW = 5 * 1000; // 10 seconds

function detectFlood(userId) {
  const now = Date.now();

  // Get previous message timestamps
  let timestamps = userMessages.get(userId) || [];

  // Remove timestamps outside the time window
  timestamps = timestamps.filter(
    (timestamp) => now - timestamp < TIME_WINDOW
  );

  // Add the current message
  timestamps.push(now);

  // Save updated timestamps
  userMessages.set(userId, timestamps);

  // Check if user exceeded the limit
  if (timestamps.length > MAX_MESSAGES) {
    return {
      isFlooding: true,
      reason: "message_flooding",
      messageCount: timestamps.length,
    };
  }

  return {
    isFlooding: false,
    messageCount: timestamps.length,
  };
}

module.exports = detectFlood;