import { setupTestDb, teardownTestDb, testPrisma } from "../helpers/testDb";
import { createTestBusinessWithOwner, createTestAsset } from "../helpers/factories";
import { maintenanceService } from "../../src/services/maintenanceService";

let businessId: string;
let ownerId: string;
let assetId: string;

beforeAll(async () => {
  await setupTestDb();
  const { business, owner } = await createTestBusinessWithOwner();
  businessId = business.id;
  ownerId = owner.id;
  const asset = await createTestAsset(businessId, ownerId);
  assetId = asset.id;
});

afterAll(async () => {
  await teardownTestDb();
});

describe("Maintenance due calculations", () => {
  it("time_interval schedule: overdue when past due date", async () => {
    const schedule = await testPrisma.maintenanceSchedule.create({
      data: {
        assetId,
        businessId,
        createdBy: ownerId,
        title: "Overdue Time Schedule",
        triggerType: "time_interval",
        intervalDays: 7,
        lastCompletedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
    });

    const result = await maintenanceService.getScheduleById(businessId, schedule.id);
    expect(result.dueStatus).toBe("overdue");
  });

  it("time_interval schedule: on track when within interval", async () => {
    const schedule = await testPrisma.maintenanceSchedule.create({
      data: {
        assetId,
        businessId,
        createdBy: ownerId,
        title: "On Track Time Schedule",
        triggerType: "time_interval",
        intervalDays: 30,
        lastCompletedAt: new Date(), // just completed
      },
    });

    const result = await maintenanceService.getScheduleById(businessId, schedule.id);
    expect(result.dueStatus).toBe("on_track");
  });

  it("time_interval schedule: due soon within 10% buffer", async () => {
    const intervalDays = 100;
    const buffer = intervalDays * 0.1; // 10 days
    // Set lastCompleted so remaining is 5 days (within 10% buffer)
    const daysAgo = intervalDays - 5;

    const schedule = await testPrisma.maintenanceSchedule.create({
      data: {
        assetId,
        businessId,
        createdBy: ownerId,
        title: "Due Soon Time Schedule",
        triggerType: "time_interval",
        intervalDays,
        lastCompletedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      },
    });

    const result = await maintenanceService.getScheduleById(businessId, schedule.id);
    expect(result.dueStatus).toBe("due_soon");
  });

  it("schedule never completed: counts as overdue for time_interval", async () => {
    const schedule = await testPrisma.maintenanceSchedule.create({
      data: {
        assetId,
        businessId,
        createdBy: ownerId,
        title: "Never Completed",
        triggerType: "time_interval",
        intervalDays: 7,
        lastCompletedAt: null, // never completed
      },
    });

    // Asset purchaseDate is 2025-01-01 — well over 7 days ago
    const result = await maintenanceService.getScheduleById(businessId, schedule.id);
    expect(result.dueStatus).toBe("overdue");
  });

  it("usage_hours schedule: on track when below threshold", async () => {
    // No completed sessions = 0 usage hours
    const schedule = await testPrisma.maintenanceSchedule.create({
      data: {
        assetId,
        businessId,
        createdBy: ownerId,
        title: "Usage Schedule",
        triggerType: "usage_hours",
        intervalHours: 100,
        lastCompletedUsageHours: 0,
      },
    });

    const result = await maintenanceService.getScheduleById(businessId, schedule.id);
    expect(result.dueStatus).toBe("on_track");
  });

  it("usage_hours schedule: overdue when total hours exceed threshold", async () => {
    // Create completed sessions totaling over 50 hours
    const start = new Date(Date.now() - 60 * 60 * 60 * 1000); // 60 hours ago
    const end = new Date(); // now
    await testPrisma.usageSession.create({
      data: {
        assetId,
        startedBy: ownerId,
        startedAt: start,
        endedAt: end,
        endedBy: ownerId,
        status: "completed",
      },
    });

    const schedule = await testPrisma.maintenanceSchedule.create({
      data: {
        assetId,
        businessId,
        createdBy: ownerId,
        title: "Overdue Usage Schedule",
        triggerType: "usage_hours",
        intervalHours: 50,
        lastCompletedUsageHours: 0,
      },
    });

    const result = await maintenanceService.getScheduleById(businessId, schedule.id);
    expect(result.dueStatus).toBe("overdue");
  });

  it("getDueSchedules returns only overdue and due_soon", async () => {
    const due = await maintenanceService.getDueSchedules(businessId);
    // All returned should be overdue or due_soon
    for (const s of due) {
      expect(["overdue", "due_soon"]).toContain(s.dueStatus);
    }
  });
});
