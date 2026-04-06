"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sopController_1 = require("../controllers/sopController");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const validateRequest_1 = require("../middleware/validateRequest");
const rateLimiter_1 = require("../middleware/rateLimiter");
const sopValidator_1 = require("../validators/sopValidator");
const router = (0, express_1.Router)({ mergeParams: true });
// All routes require authentication + business membership
router.use(authenticate_1.authenticate, authenticate_1.requireMembership);
// GET /api/businesses/:businessId/sops
router.get("/", sopController_1.sopController.getAll);
// POST /api/businesses/:businessId/sops (owner only)
router.post("/", rateLimiter_1.generalLimiter, (0, authorize_1.authorize)("owner"), (0, validateRequest_1.validateRequest)(sopValidator_1.createSopSchema), sopController_1.sopController.create);
// GET /api/businesses/:businessId/sops/:id
router.get("/:id", sopController_1.sopController.getById);
// PUT /api/businesses/:businessId/sops/:id (owner only)
router.put("/:id", rateLimiter_1.generalLimiter, (0, authorize_1.authorize)("owner"), (0, validateRequest_1.validateRequest)(sopValidator_1.updateSopSchema), sopController_1.sopController.update);
// DELETE /api/businesses/:businessId/sops/:id
router.delete("/:id", rateLimiter_1.generalLimiter, (0, authorize_1.authorize)("owner"), sopController_1.sopController.delete);
exports.default = router;
