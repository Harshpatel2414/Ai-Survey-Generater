const rateLimitStore = new Map();

export const rateLimiter = (key, maxAttempts, timeWindow) => {
  const now = Date.now();

  // Retrieve or initialize the rate limit data for the key
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }

  const attempts = rateLimitStore.get(key);
  const filteredAttempts = attempts.filter((timestamp) => now - timestamp < timeWindow);

  if (filteredAttempts.length >= maxAttempts) {
    return false;
  }

  // Add the current attempt and update the store
  filteredAttempts.push(now);
  rateLimitStore.set(key, filteredAttempts);

  return true;
};
