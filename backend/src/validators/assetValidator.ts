import { z } from "zod/v4";

export const createAssetSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  brand: z.string().min(1).max(100).trim(),
  model: z.string().min(1).max(100).trim(),
  serialNumber: z.string().min(1).max(100).trim(),
  purchaseDate: z.iso.date(),
  nfcTagId: z.string().max(100).trim().optional(),
});

export const updateAssetSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  brand: z.string().min(1).max(100).trim().optional(),
  model: z.string().min(1).max(100).trim().optional(),
  serialNumber: z.string().min(1).max(100).trim().optional(),
  purchaseDate: z.iso.date().optional(),
  nfcTagId: z.string().max(100).trim().optional(),
});

export const updateAssetStatusSchema = z.object({
  status: z.enum(["available", "in_use", "maintenance"]),
});
