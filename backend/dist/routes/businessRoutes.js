"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const businessController_1 = require("../controllers/businessController");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const validateRequest_1 = require("../middleware/validateRequest");
const rateLimiter_1 = require("../middleware/rateLimiter");
const businessValidator_1 = require("../validators/businessValidator");
const router = (0, express_1.Router)();
// POST /api/businesses — create a business (user must be authenticated but no membership yet)
router.post("/", rateLimiter_1.generalLimiter, authenticate_1.authenticate, (0, validateRequest_1.validateRequest)(businessValidator_1.createBusinessSchema), businessController_1.businessController.createBusiness);
// POST /api/businesses/join — join a business by code
router.post("/join", rateLimiter_1.generalLimiter, authenticate_1.authenticate, (0, validateRequest_1.validateRequest)(businessValidator_1.joinBusinessSchema), businessController_1.businessController.joinBusiness);
// GET /api/businesses/:businessId
router.get("/:businessId", authenticate_1.authenticate, authenticate_1.requireMembership, businessController_1.businessController.getBusiness);
// PUT /api/businesses/:businessId
router.put("/:businessId", rateLimiter_1.generalLimiter, authenticate_1.authenticate, authenticate_1.requireMembership, (0, authorize_1.authorize)("owner"), (0, validateRequest_1.validateRequest)(businessValidator_1.updateBusinessSchema), businessController_1.businessController.updateBusiness);
// GET /api/businesses/:businessId/members
router.get("/:businessId/members", authenticate_1.authenticate, authenticate_1.requireMembership, businessController_1.businessController.getMembers);
// DELETE /api/businesses/:businessId/members/:userId
router.delete("/:businessId/members/:userId", rateLimiter_1.generalLimiter, authenticate_1.authenticate, authenticate_1.requireMembership, (0, authorize_1.authorize)("owner"), businessController_1.businessController.removeMember);
exports.default = router;
