"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("../generated/prisma/client");
// Use a smaller connection pool to avoid exhausting Supabase PgBouncer limits.
// PgBouncer (port 6543) has its own pool; Prisma should not hog too many connections.
exports.prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: `${process.env.DATABASE_URL}&connection_limit=5&pool_timeout=30`,
        },
    },
});
