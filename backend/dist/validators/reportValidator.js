"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReportSchema = exports.createReportSchema = void 0;
const v4_1 = require("zod/v4");
exports.createReportSchema = v4_1.z.object({
    title: v4_1.z.string().min(1).max(200).trim(),
    description: v4_1.z.string().min(1).max(2000).trim(),
    severity: v4_1.z.enum(["low", "medium", "high", "critical"]),
    assetId: v4_1.z.uuid(),
    sessionId: v4_1.z.uuid().optional(),
});
exports.updateReportSchema = v4_1.z.object({
    title: v4_1.z.string().min(1).max(200).trim().optional(),
    description: v4_1.z.string().min(1).max(2000).trim().optional(),
    severity: v4_1.z.enum(["low", "medium", "high", "critical"]).optional(),
    status: v4_1.z.enum(["open", "in_progress", "resolved"]).optional(),
});
