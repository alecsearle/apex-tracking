import { z } from "zod/v4";

export const createSopSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  content: z.string().min(1).max(50000).trim(),
  assetId: z.uuid().optional(),
});

export const updateSopSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  content: z.string().min(1).max(50000).trim().optional(),
});
