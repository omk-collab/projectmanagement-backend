import rateLimit from "express-rate-limit";

// ========================================
// Authentication Rate Limiter
// Login / Register
// ========================================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 30, // 30 attempts per IP

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again after 15 minutes.",
  },
});

// ========================================
// Email Rate Limiter
// Forgot Password / Resend Verification
// ========================================

const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many email requests. Please try again later.",
  },
});

// ========================================
// Password Reset Rate Limiter
// ========================================

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many password reset attempts. Please try again later.",
  },
});

export { authLimiter, emailLimiter, passwordResetLimiter };
