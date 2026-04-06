"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Import env first — triggers Zod validation, crashes early if env is wrong
const env_1 = require("./config/env");
const prisma_1 = require("./config/prisma");
const supabase_1 = require("./config/supabase");
const app_1 = __importDefault(require("./app"));
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)({ name: "server" });
/** Ensure Supabase storage buckets exist (creates them if missing). */
async function ensureStorageBuckets() {
    const buckets = [
        env_1.env.SUPABASE_STORAGE_BUCKET_ASSETS,
        env_1.env.SUPABASE_STORAGE_BUCKET_REPORTS,
        env_1.env.SUPABASE_STORAGE_BUCKET_MAINTENANCE,
    ];
    for (const bucket of buckets) {
        const { error } = await supabase_1.supabaseAdmin.storage.createBucket(bucket, {
            public: true,
            fileSizeLimit: 20 * 1024 * 1024,
        });
        if (error && !error.message.includes("already exists")) {
            logger.warn({ bucket, error: error.message }, "Failed to create storage bucket");
        }
    }
    logger.info("Storage buckets verified");
}
async function main() {
    // Verify database connection
    await prisma_1.prisma.$connect();
    logger.info("Database connected");
    // Ensure storage buckets exist
    await ensureStorageBuckets();
    app_1.default.listen(env_1.env.PORT, () => {
        logger.info(`Server running on port ${env_1.env.PORT} (${env_1.env.NODE_ENV})`);
    });
}
main().catch((err) => {
    logger.error(err, "Failed to start server");
    process.exit(1);
});
