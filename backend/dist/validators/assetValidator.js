"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAssetStatusSchema = exports.updateAssetSchema = exports.createAssetSchema = void 0;
const v4_1 = require("zod/v4");
exports.createAssetSchema = v4_1.z.object({
    name: v4_1.z.string().min(1).max(100).trim(),
    brand: v4_1.z.string().min(1).max(100).trim(),
    model: v4_1.z.string().min(1).max(100).trim(),
    serialNumber: v4_1.z.string().min(1).max(100).trim(),
    purchaseDate: v4_1.z.iso.date(),
    nfcTagId: v4_1.z.string().max(100).trim().optional(),
});
exports.updateAssetSchema = v4_1.z.object({
    name: v4_1.z.string().min(1).max(100).trim().optional(),
    brand: v4_1.z.string().min(1).max(100).trim().optional(),
    model: v4_1.z.string().min(1).max(100).trim().optional(),
    serialNumber: v4_1.z.string().min(1).max(100).trim().optional(),
    purchaseDate: v4_1.z.iso.date().optional(),
    nfcTagId: v4_1.z.string().max(100).trim().optional(),
});
exports.updateAssetStatusSchema = v4_1.z.object({
    status: v4_1.z.enum(["available", "in_use", "maintenance"]),
});
