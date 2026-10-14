import rateLimit from "express-rate-limit";

export const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes (reduced from 60 minutes)
  max: 150, // 150 registration attempts per IP per 15 minutes (supports shared college Wi-Fi & labs)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many registration attempts from this network. Please try again after 15 minutes.",
    },
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many failed login attempts. Please try again after 15 minutes.",
    },
  },
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
