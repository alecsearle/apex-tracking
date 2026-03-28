import dotenv from "dotenv";
dotenv.config();

// Import env first — triggers Zod validation, crashes early if env is wrong
import { env } from "./config/env";
import { prisma } from "./config/prisma";
import { supabaseAdmin } from "./config/supabase";
import app from "./app";
import pino from "pino";

const logger = pino({ name: "server" });

/** Ensure Supabase storage buckets exist (creates them if missing). */
async function ensureStorageBuckets() {
  const buckets = [
    env.SUPABASE_STORAGE_BUCKET_ASSETS,
    env.SUPABASE_STORAGE_BUCKET_REPORTS,
    env.SUPABASE_STORAGE_BUCKET_MAINTENANCE,
  ];

  for (const bucket of buckets) {
    const { error } = await supabaseAdmin.storage.createBucket(bucket, {
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
  await prisma.$connect();
  logger.info("Database connected");

  // Ensure storage buckets exist
  await ensureStorageBuckets();

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

main().catch((err) => {
  logger.error(err, "Failed to start server");
  process.exit(1);
});
