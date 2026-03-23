import { Router } from "express";
import { maintenanceController } from "../controllers/maintenanceController";
import { authenticate, requireMembership } from "../middleware/authenticate";

import { validateRequest } from "../middleware/validateRequest";
import { generalLimiter, uploadLimiter } from "../middleware/rateLimiter";
import { uploadImage } from "../middleware/multerConfig";
import {
  createScheduleSchema,
  updateScheduleSchema,
  completeScheduleSchema,
} from "../validators/maintenanceValidator";

const router = Router({ mergeParams: true });

// All routes require authentication + business membership
router.use(authenticate, requireMembership);

// GET /api/businesses/:businessId/maintenance/schedules
router.get("/schedules", maintenanceController.getSchedules);

// POST /api/businesses/:businessId/maintenance/schedules (any member can create)
router.post(
  "/schedules",
  generalLimiter,
  validateRequest(createScheduleSchema),
  maintenanceController.createSchedule
);

// GET /api/businesses/:businessId/maintenance/schedules/:id
router.get("/schedules/:id", maintenanceController.getScheduleById);

// PUT /api/businesses/:businessId/maintenance/schedules/:id (creator or owner)
router.put(
  "/schedules/:id",
  generalLimiter,
  validateRequest(updateScheduleSchema),
  maintenanceController.updateSchedule
);

// DELETE /api/businesses/:businessId/maintenance/schedules/:id (creator or owner)
router.delete(
  "/schedules/:id",
  generalLimiter,
  maintenanceController.deleteSchedule
);

// GET /api/businesses/:businessId/maintenance/due
router.get("/due", maintenanceController.getDueSchedules);

// POST /api/businesses/:businessId/maintenance/schedules/:id/complete
router.post(
  "/schedules/:id/complete",
  generalLimiter,
  validateRequest(completeScheduleSchema),
  maintenanceController.completeSchedule
);

// GET /api/businesses/:businessId/maintenance/schedules/:id/logs
router.get("/schedules/:id/logs", maintenanceController.getLogs);

// POST /api/businesses/:businessId/maintenance/logs/:logId/photos
router.post(
  "/logs/:logId/photos",
  uploadLimiter,
  uploadImage,
  maintenanceController.addLogPhoto
);

// DELETE /api/businesses/:businessId/maintenance/logs/:logId/photos/:photoId
router.delete(
  "/logs/:logId/photos/:photoId",
  generalLimiter,
  maintenanceController.deleteLogPhoto
);

export default router;
