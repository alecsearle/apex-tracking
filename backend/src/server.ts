import dotenv from "dotenv";
dotenv.config();

// Import env first — triggers Zod validation, crashes early if env is wrong
import { env } from "./config/env";
import { prisma } from "./config/prisma";
import app from "./app";
import pino from "pino";

const logger = pino({ name: "server" });

async function main() {
  // Verify database connection
  await prisma.$connect();
  logger.info("Database connected");

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

main().catch((err) => {
  logger.error(err, "Failed to start server");
  process.exit(1);
});
