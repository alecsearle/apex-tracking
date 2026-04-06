"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSopSchema = exports.createSopSchema = void 0;
const v4_1 = require("zod/v4");
exports.createSopSchema = v4_1.z.object({
    title: v4_1.z.string().min(1).max(200).trim(),
    content: v4_1.z.string().min(1).max(50000).trim(),
    assetId: v4_1.z.uuid().optional(),
});
exports.updateSopSchema = v4_1.z.object({
    title: v4_1.z.string().min(1).max(200).trim().optional(),
    content: v4_1.z.string().min(1).max(50000).trim().optional(),
});
