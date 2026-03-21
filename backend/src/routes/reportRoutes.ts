import { Router } from "express";
import { reportController } from "../controllers/reportController";
import { authenticate, requireMembership } from "../middleware/authenticate";
import { validateRequest } from "../middleware/validateRequest";
import { generalLimiter, uploadLimiter } from "../middleware/rateLimiter";
import { uploadImage } from "../middleware/multerConfig";
import { createReportSchema, updateReportSchema } from "../validators/reportValidator";

const router = Router({ mergeParams: true });

// All routes require authentication + business membership
router.use(authenticate, requireMembership);

// POST /api/businesses/:businessId/reports
router.post(
  "/",
  generalLimiter,
  validateRequest(createReportSchema),
  reportController.create
);

// GET /api/businesses/:businessId/reports
router.get("/", reportController.getAll);

// GET /api/businesses/:businessId/reports/:id
router.get("/:id", reportController.getById);

// PUT /api/businesses/:businessId/reports/:id
router.put(
  "/:id",
  generalLimiter,
  validateRequest(updateReportSchema),
  reportController.update
);

// POST /api/businesses/:businessId/reports/:id/photos
router.post("/:id/photos", uploadLimiter, uploadImage, reportController.addPhoto);

// DELETE /api/businesses/:businessId/reports/:id/photos/:photoId
router.delete("/:id/photos/:photoId", generalLimiter, reportController.deletePhoto);

export default router;
