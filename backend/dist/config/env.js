"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const v4_1 = require("zod/v4");
const envSchema = v4_1.z.object({
    PORT: v4_1.z.coerce.number().default(8080),
    NODE_ENV: v4_1.z.enum(["development", "production", "test"]).default("development"),
    SUPABASE_URL: v4_1.z.url(),
    SUPABASE_SERVICE_ROLE_KEY: v4_1.z.string().min(1),
    DATABASE_URL: v4_1.z.string().min(1),
    SUPABASE_STORAGE_BUCKET_ASSETS: v4_1.z.string().min(1),
    SUPABASE_STORAGE_BUCKET_REPORTS: v4_1.z.string().min(1),
    SUPABASE_STORAGE_BUCKET_MAINTENANCE: v4_1.z.string().min(1),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("Invalid environment variables:");
    console.error(parsed.error.format());
    process.exit(1);
}
exports.env = parsed.data;
