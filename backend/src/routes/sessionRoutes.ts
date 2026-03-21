import { Router } from "express";
import { sessionController } from "../controllers/sessionController";
import { authenticate, requireMembership } from "../middleware/authenticate";
import { validateRequest } from "../middleware/validateRequest";
import { generalLimiter } from "../middleware/rateLimiter";
import { startSessionSchema, endSessionSchema } from "../validators/sessionValidator";

const router = Router({ mergeParams: true });

// All routes require authentication + business membership
router.use(authenticate, requireMembership);

// POST /api/businesses/:businessId/sessions — start a session
router.post(
  "/",
  generalLimiter,
  validateRequest(startSessionSchema),
  sessionController.startSession
);

// PUT /api/businesses/:businessId/sessions/:sessionId/end — end a session
router.put(
  "/:sessionId/end",
  generalLimiter,
  validateRequest(endSessionSchema),
  sessionController.endSession
);

// GET /api/businesses/:businessId/sessions/active — all active sessions
router.get("/active", sessionController.getActiveSessions);

export default router;
