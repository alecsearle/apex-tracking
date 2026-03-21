import { z } from "zod/v4";

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  SUPABASE_STORAGE_BUCKET_ASSETS: z.string().min(1),
  SUPABASE_STORAGE_BUCKET_REPORTS: z.string().min(1),
  SUPABASE_STORAGE_BUCKET_MAINTENANCE: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
