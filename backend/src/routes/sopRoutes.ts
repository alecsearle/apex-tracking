import { Router } from "express";
import { sopController } from "../controllers/sopController";
import { authenticate, requireMembership } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { validateRequest } from "../middleware/validateRequest";
import { generalLimiter } from "../middleware/rateLimiter";
import { createSopSchema, updateSopSchema } from "../validators/sopValidator";

const router = Router({ mergeParams: true });

// All routes require authentication + business membership
router.use(authenticate, requireMembership);

// GET /api/businesses/:businessId/sops
router.get("/", sopController.getAll);

// POST /api/businesses/:businessId/sops (owner only)
router.post(
  "/",
  generalLimiter,
  authorize("owner"),
  validateRequest(createSopSchema),
  sopController.create
);

// GET /api/businesses/:businessId/sops/:id
router.get("/:id", sopController.getById);

// PUT /api/businesses/:businessId/sops/:id (owner only)
router.put(
  "/:id",
  generalLimiter,
  authorize("owner"),
  validateRequest(updateSopSchema),
  sopController.update
);

// DELETE /api/businesses/:businessId/sops/:id
router.delete("/:id", generalLimiter, authorize("owner"), sopController.delete);

export default router;
