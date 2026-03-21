import { Router } from "express";
import { authController } from "../controllers/authController";
import { authenticate } from "../middleware/authenticate";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

// POST /api/auth/sync — no authenticate middleware (user may not be in DB yet)
router.post("/sync", authLimiter, authController.syncUser);

// GET /api/auth/me — returns user profile + membership (requires auth)
router.get("/me", authenticate, authController.getMe);

export default router;
