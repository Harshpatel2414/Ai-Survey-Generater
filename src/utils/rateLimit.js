const rateLimitStore = new Map();

export const rateLimiter = (key, maxAttempts, timeWindow) => {
  const now = Date.now();
  const attempts = rateLimitStore.get(key) || [];
  const filteredAttempts = attempts.filter((timestamp) => now - timestamp < timeWindow);

  if (filteredAttempts.length >= maxAttempts) {
    return false; 
  }

  filteredAttempts.push(now);
  rateLimitStore.set(key, filteredAttempts);
  return true;
};