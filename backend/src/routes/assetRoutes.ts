import { Router } from "express";
import { assetController } from "../controllers/assetController";
import { authenticate, requireMembership } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { validateRequest } from "../middleware/validateRequest";
import { generalLimiter, uploadLimiter } from "../middleware/rateLimiter";
import { uploadImage, uploadPdf } from "../middleware/multerConfig";
import { createAssetSchema, updateAssetSchema } from "../validators/assetValidator";

const router = Router({ mergeParams: true });

// All routes require authentication + business membership
router.use(authenticate, requireMembership);

// GET /api/businesses/:businessId/assets
router.get("/", assetController.getAll);

// POST /api/businesses/:businessId/assets
router.post(
  "/",
  generalLimiter,
  validateRequest(createAssetSchema),
  assetController.create
);

// GET /api/businesses/:businessId/assets/:id
router.get("/:id", assetController.getById);

// PUT /api/businesses/:businessId/assets/:id
router.put(
  "/:id",
  generalLimiter,
  authorize("owner"),
  validateRequest(updateAssetSchema),
  assetController.update
);

// DELETE /api/businesses/:businessId/assets/:id
router.delete("/:id", generalLimiter, authorize("owner"), assetController.delete);

// POST /api/businesses/:businessId/assets/:id/photo
router.post(
  "/:id/photo",
  uploadLimiter,
  authorize("owner"),
  uploadImage,
  assetController.uploadPhoto
);

// DELETE /api/businesses/:businessId/assets/:id/photo
router.delete(
  "/:id/photo",
  generalLimiter,
  authorize("owner"),
  assetController.deletePhoto
);

// POST /api/businesses/:businessId/assets/:id/manual
router.post(
  "/:id/manual",
  uploadLimiter,
  authorize("owner"),
  uploadPdf,
  assetController.uploadManual
);

// DELETE /api/businesses/:businessId/assets/:id/manual
router.delete(
  "/:id/manual",
  generalLimiter,
  authorize("owner"),
  assetController.deleteManual
);

export default router;
