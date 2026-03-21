import { PrismaClient } from "../generated/prisma/client";

// Use a smaller connection pool to avoid exhausting Supabase PgBouncer limits.
// PgBouncer (port 6543) has its own pool; Prisma should not hog too many connections.
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `${process.env.DATABASE_URL}&connection_limit=5&pool_timeout=30`,
    },
  },
});
