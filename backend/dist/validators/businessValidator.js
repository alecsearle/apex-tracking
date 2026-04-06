"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinBusinessSchema = exports.updateBusinessSchema = exports.createBusinessSchema = void 0;
const v4_1 = require("zod/v4");
exports.createBusinessSchema = v4_1.z.object({
    name: v4_1.z.string().min(1).max(100).trim(),
});
exports.updateBusinessSchema = v4_1.z.object({
    name: v4_1.z.string().min(1).max(100).trim().optional(),
});
exports.joinBusinessSchema = v4_1.z.object({
    businessCode: v4_1.z.string().regex(/^APEX-[A-Z0-9]{4}$/, "Invalid business code format"),
});
