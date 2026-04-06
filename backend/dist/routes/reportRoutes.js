"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const authenticate_1 = require("../middleware/authenticate");
const validateRequest_1 = require("../middleware/validateRequest");
const rateLimiter_1 = require("../middleware/rateLimiter");
const multerConfig_1 = require("../middleware/multerConfig");
const reportValidator_1 = require("../validators/reportValidator");
const router = (0, express_1.Router)({ mergeParams: true });
// All routes require authentication + business membership
router.use(authenticate_1.authenticate, authenticate_1.requireMembership);
// POST /api/businesses/:businessId/reports
router.post("/", rateLimiter_1.generalLimiter, (0, validateRequest_1.validateRequest)(reportValidator_1.createReportSchema), reportController_1.reportController.create);
// GET /api/businesses/:businessId/reports
router.get("/", reportController_1.reportController.getAll);
// GET /api/businesses/:businessId/reports/:id
router.get("/:id", reportController_1.reportController.getById);
// PUT /api/businesses/:businessId/reports/:id
router.put("/:id", rateLimiter_1.generalLimiter, (0, validateRequest_1.validateRequest)(reportValidator_1.updateReportSchema), reportController_1.reportController.update);
// POST /api/businesses/:businessId/reports/:id/photos
router.post("/:id/photos", rateLimiter_1.uploadLimiter, multerConfig_1.uploadImage, reportController_1.reportController.addPhoto);
// DELETE /api/businesses/:businessId/reports/:id/photos/:photoId
router.delete("/:id/photos/:photoId", rateLimiter_1.generalLimiter, reportController_1.reportController.deletePhoto);
exports.default = router;
