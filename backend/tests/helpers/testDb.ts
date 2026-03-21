import { PrismaClient } from "../../src/generated/prisma/client";

export const testPrisma = new PrismaClient();

/**
 * Truncate all tables in correct order (respecting foreign keys).
 */
export async function cleanDatabase() {
  await testPrisma.$transaction([
    testPrisma.maintenanceLogPhoto.deleteMany(),
    testPrisma.maintenanceLog.deleteMany(),
    testPrisma.maintenanceSchedule.deleteMany(),
    testPrisma.reportPhoto.deleteMany(),
    testPrisma.maintenanceReport.deleteMany(),
    testPrisma.usageSession.deleteMany(),
    testPrisma.sop.deleteMany(),
    testPrisma.asset.deleteMany(),
    testPrisma.membership.deleteMany(),
    testPrisma.business.deleteMany(),
    testPrisma.user.deleteMany(),
  ]);
}

export async function setupTestDb() {
  await testPrisma.$connect();
  await cleanDatabase();
}

export async function teardownTestDb() {
  await cleanDatabase();
  await testPrisma.$disconnect();
}
