import { Router } from "express";
import { businessController } from "../controllers/businessController";
import { authenticate, requireMembership } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { validateRequest } from "../middleware/validateRequest";
import { generalLimiter } from "../middleware/rateLimiter";
import {
  createBusinessSchema,
  updateBusinessSchema,
  joinBusinessSchema,
} from "../validators/businessValidator";

const router = Router();

// POST /api/businesses — create a business (user must be authenticated but no membership yet)
router.post(
  "/",
  generalLimiter,
  authenticate,
  validateRequest(createBusinessSchema),
  businessController.createBusiness
);

// POST /api/businesses/join — join a business by code
router.post(
  "/join",
  generalLimiter,
  authenticate,
  validateRequest(joinBusinessSchema),
  businessController.joinBusiness
);

// GET /api/businesses/:businessId
router.get(
  "/:businessId",
  authenticate,
  requireMembership,
  businessController.getBusiness
);

// PUT /api/businesses/:businessId
router.put(
  "/:businessId",
  generalLimiter,
  authenticate,
  requireMembership,
  authorize("owner"),
  validateRequest(updateBusinessSchema),
  businessController.updateBusiness
);

// GET /api/businesses/:businessId/members
router.get(
  "/:businessId/members",
  authenticate,
  requireMembership,
  businessController.getMembers
);

// DELETE /api/businesses/:businessId/members/:userId
router.delete(
  "/:businessId/members/:userId",
  generalLimiter,
  authenticate,
  requireMembership,
  authorize("owner"),
  businessController.removeMember
);

export default router;
