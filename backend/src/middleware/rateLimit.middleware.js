const rateLimit = require('express-rate-limit');

/**
 * Generic limiter for sensitive operations
 */
const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                 // max 10 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many attempts. Please try again later.'
  }
});

/**
 * Very strict limiter for admin money actions
 */
const adminMoneyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,                  // tighter limit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many admin financial actions. Slow down.'
  }
});

module.exports = {
  sensitiveLimiter,
  adminMoneyLimiter
};
