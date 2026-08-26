// warningManager.js

const warnings = new Map();

// Configuration
const MAX_WARNINGS = 3;

// Optional: warnings expire after 24 hours
const WARNING_EXPIRY = 24 * 60 * 60 * 1000;

/**
 * Add a warning to a user
 */
function addWarning(userId) {
  const now = Date.now();

  let userWarning = warnings.get(userId);

  // Create a new warning record
  if (!userWarning) {
    userWarning = {
      count: 0,
      lastWarning: now,
    };
  }

  // Reset warnings if they have expired
  if (now - userWarning.lastWarning > WARNING_EXPIRY) {
    userWarning.count = 0;
  }

  // Add warning
  userWarning.count += 1;
  userWarning.lastWarning = now;

  warnings.set(userId, userWarning);

  return {
    count: userWarning.count,
    maxWarnings: MAX_WARNINGS,
    shouldRestrict: userWarning.count >= MAX_WARNINGS,
  };
}

/**
 * Get a user's current warnings
 */
function getWarnings(userId) {
  const userWarning = warnings.get(userId);

  if (!userWarning) {
    return 0;
  }

  const now = Date.now();

  // Check if warnings have expired
  if (now - userWarning.lastWarning > WARNING_EXPIRY) {
    warnings.delete(userId);
    return 0;
  }

  return userWarning.count;
}

/**
 * Reset a user's warnings
 */
function resetWarnings(userId) {
  warnings.delete(userId);
}

/**
 * Remove one warning
 */
function removeWarning(userId) {
  const userWarning = warnings.get(userId);

  if (!userWarning) {
    return 0;
  }

  userWarning.count -= 1;

  if (userWarning.count <= 0) {
    warnings.delete(userId);
    return 0;
  }

  warnings.set(userId, userWarning);

  return userWarning.count;
}

module.exports = {
  addWarning,
  getWarnings,
  resetWarnings,
  removeWarning,
  MAX_WARNINGS,
};