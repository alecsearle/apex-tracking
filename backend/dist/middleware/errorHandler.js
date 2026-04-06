"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_1 = require("../utils/errors");
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)({ name: "error-handler" });
/**
 * Global error handler — must be registered last in Express middleware chain.
 * Returns consistent JSON error responses per ARCHITECTURE.md.
 */
function errorHandler(err, _req, res, _next) {
    // Known application errors
    if (err instanceof errors_1.AppError) {
        res.status(err.statusCode).json({
            error: err.message,
            code: err.code,
            statusCode: err.statusCode,
        });
        return;
    }
    // Prisma unique constraint violation
    if (err.code === "P2002") {
        const target = err.meta?.target;
        const field = target?.[0] ?? "unknown";
        logger.warn({ target }, "Prisma P2002 unique constraint violation");
        res.status(409).json({
            error: `Duplicate entry`,
            field,
            code: "CONFLICT",
            statusCode: 409,
        });
        return;
    }
    // Prisma record not found
    if (err.code === "P2025") {
        res.status(404).json({
            error: "Record not found",
            code: "NOT_FOUND",
            statusCode: 404,
        });
        return;
    }
    // Unexpected errors
    logger.error(err, "Unhandled error");
    res.status(500).json({
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        statusCode: 500,
    });
}
