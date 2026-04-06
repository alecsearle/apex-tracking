"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const maintenanceController_1 = require("../controllers/maintenanceController");
const authenticate_1 = require("../middleware/authenticate");
const validateRequest_1 = require("../middleware/validateRequest");
const rateLimiter_1 = require("../middleware/rateLimiter");
const multerConfig_1 = require("../middleware/multerConfig");
const maintenanceValidator_1 = require("../validators/maintenanceValidator");
const router = (0, express_1.Router)({ mergeParams: true });
// All routes require authentication + business membership
router.use(authenticate_1.authenticate, authenticate_1.requireMembership);
// GET /api/businesses/:businessId/maintenance/schedules
router.get("/schedules", maintenanceController_1.maintenanceController.getSchedules);
// POST /api/businesses/:businessId/maintenance/schedules (any member can create)
router.post("/schedules", rateLimiter_1.generalLimiter, (0, validateRequest_1.validateRequest)(maintenanceValidator_1.createScheduleSchema), maintenanceController_1.maintenanceController.createSchedule);
// GET /api/businesses/:businessId/maintenance/schedules/:id
router.get("/schedules/:id", maintenanceController_1.maintenanceController.getScheduleById);
// PUT /api/businesses/:businessId/maintenance/schedules/:id (creator or owner)
router.put("/schedules/:id", rateLimiter_1.generalLimiter, (0, validateRequest_1.validateRequest)(maintenanceValidator_1.updateScheduleSchema), maintenanceController_1.maintenanceController.updateSchedule);
// DELETE /api/businesses/:businessId/maintenance/schedules/:id (creator or owner)
router.delete("/schedules/:id", rateLimiter_1.generalLimiter, maintenanceController_1.maintenanceController.deleteSchedule);
// GET /api/businesses/:businessId/maintenance/due
router.get("/due", maintenanceController_1.maintenanceController.getDueSchedules);
// POST /api/businesses/:businessId/maintenance/schedules/:id/complete
router.post("/schedules/:id/complete", rateLimiter_1.generalLimiter, (0, validateRequest_1.validateRequest)(maintenanceValidator_1.completeScheduleSchema), maintenanceController_1.maintenanceController.completeSchedule);
// GET /api/businesses/:businessId/maintenance/schedules/:id/logs
router.get("/schedules/:id/logs", maintenanceController_1.maintenanceController.getLogs);
// POST /api/businesses/:businessId/maintenance/logs/:logId/photos
router.post("/logs/:logId/photos", rateLimiter_1.uploadLimiter, multerConfig_1.uploadImage, maintenanceController_1.maintenanceController.addLogPhoto);
// DELETE /api/businesses/:businessId/maintenance/logs/:logId/photos/:photoId
router.delete("/logs/:logId/photos/:photoId", rateLimiter_1.generalLimiter, maintenanceController_1.maintenanceController.deleteLogPhoto);
exports.default = router;
