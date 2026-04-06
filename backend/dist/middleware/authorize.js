"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
const errors_1 = require("../utils/errors");
/**
 * Role-based authorization middleware factory.
 * Must be used after authenticate + requireMembership.
 */
function authorize(...roles) {
    return (req, _res, next) => {
        if (!req.membership) {
            throw new errors_1.ForbiddenError("No business membership found");
        }
        if (!roles.includes(req.membership.role)) {
            throw new errors_1.ForbiddenError("Insufficient permissions");
        }
        next();
    };
}
