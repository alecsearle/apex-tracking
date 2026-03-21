import rateLimit from "express-rate-limit";

/**
 * Rate limiters per ARCHITECTURE.md section F:
 * - Auth routes: 5 req/min per IP
 * - General routes: 100 req/min per IP
 * - Upload routes: 20 req/min per IP
 */

export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests", code: "RATE_LIMITED", statusCode: 429 },
});

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests", code: "RATE_LIMITED", statusCode: 429 },
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests", code: "RATE_LIMITED", statusCode: 429 },
});
