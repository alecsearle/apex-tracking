import { z } from "zod/v4";

export const createBusinessSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

export const updateBusinessSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
});

export const joinBusinessSchema = z.object({
  businessCode: z.string().regex(/^APEX-[A-Z0-9]{4}$/, "Invalid business code format"),
});
