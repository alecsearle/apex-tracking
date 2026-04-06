"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endSessionSchema = exports.startSessionSchema = void 0;
const v4_1 = require("zod/v4");
exports.startSessionSchema = v4_1.z.object({
    assetId: v4_1.z.uuid(),
    notes: v4_1.z.string().max(500).trim().optional(),
    jobSiteName: v4_1.z.string().max(200).trim().optional(),
});
exports.endSessionSchema = v4_1.z.object({
    notes: v4_1.z.string().max(500).trim().optional(),
    totalPausedMs: v4_1.z.number().int().min(0).optional(),
});
