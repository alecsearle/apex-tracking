"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assetController_1 = require("../controllers/assetController");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const validateRequest_1 = require("../middleware/validateRequest");
const rateLimiter_1 = require("../middleware/rateLimiter");
const multerConfig_1 = require("../middleware/multerConfig");
const assetValidator_1 = require("../validators/assetValidator");
const router = (0, express_1.Router)({ mergeParams: true });
// All routes require authentication + business membership
router.use(authenticate_1.authenticate, authenticate_1.requireMembership);
// GET /api/businesses/:businessId/assets
router.get("/", assetController_1.assetController.getAll);
// POST /api/businesses/:businessId/assets (owner only)
router.post("/", rateLimiter_1.generalLimiter, (0, authorize_1.authorize)("owner"), (0, validateRequest_1.validateRequest)(assetValidator_1.createAssetSchema), assetController_1.assetController.create);
// GET /api/businesses/:businessId/assets/:id
router.get("/:id", assetController_1.assetController.getById);
// PUT /api/businesses/:businessId/assets/:id
router.put("/:id", rateLimiter_1.generalLimiter, (0, authorize_1.authorize)("owner"), (0, validateRequest_1.validateRequest)(assetValidator_1.updateAssetSchema), assetController_1.assetController.update);
// DELETE /api/businesses/:businessId/assets/:id
router.delete("/:id", rateLimiter_1.generalLimiter, (0, authorize_1.authorize)("owner"), assetController_1.assetController.delete);
// POST /api/businesses/:businessId/assets/:id/photo
router.post("/:id/photo", rateLimiter_1.uploadLimiter, (0, authorize_1.authorize)("owner"), multerConfig_1.uploadImage, assetController_1.assetController.uploadPhoto);
// DELETE /api/businesses/:businessId/assets/:id/photo
router.delete("/:id/photo", rateLimiter_1.generalLimiter, (0, authorize_1.authorize)("owner"), assetController_1.assetController.deletePhoto);
// POST /api/businesses/:businessId/assets/:id/manual
router.post("/:id/manual", rateLimiter_1.uploadLimiter, (0, authorize_1.authorize)("owner"), multerConfig_1.uploadPdf, assetController_1.assetController.uploadManual);
// DELETE /api/businesses/:businessId/assets/:id/manual
router.delete("/:id/manual", rateLimiter_1.generalLimiter, (0, authorize_1.authorize)("owner"), assetController_1.assetController.deleteManual);
exports.default = router;
