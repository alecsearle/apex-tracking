"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const index_1 = __importDefault(require("./routes/index"));
const errorHandler_1 = require("./middleware/errorHandler");
const errors_1 = require("./utils/errors");
const app = (0, express_1.default)();
// Security headers
app.use((0, helmet_1.default)());
// CORS — configure for frontend origin in production
app.use((0, cors_1.default)({ origin: "*" }));
// Body parsing
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// API routes
app.use("/api", index_1.default);
// Root endpoint
app.get("/", (_req, res) => {
    res.json({
        message: "Apex Tracking API",
        version: "2.0.0",
        status: "running",
    });
});
// 404 handler for unmatched routes
app.use((_req, _res) => {
    throw new errors_1.NotFoundError("Route not found");
});
// Global error handler (must be last)
app.use(errorHandler_1.errorHandler);
exports.default = app;
