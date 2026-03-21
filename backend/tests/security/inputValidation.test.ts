import request from "supertest";
import { setupTestDb, teardownTestDb } from "../helpers/testDb";
import { createAuthenticatedTestApp } from "../helpers/testAppWithAuth";
import { createTestBusinessWithOwner } from "../helpers/factories";

let app: ReturnType<typeof createAuthenticatedTestApp>;
let businessId: string;

beforeAll(async () => {
  await setupTestDb();
  const { business, owner } = await createTestBusinessWithOwner();
  businessId = business.id;

  app = createAuthenticatedTestApp({
    userId: owner.id,
    email: owner.email,
    businessId: business.id,
    role: "owner",
  });
});

afterAll(async () => {
  await teardownTestDb();
});

describe("Input validation security", () => {
  it("rejects oversized strings", async () => {
    const longName = "A".repeat(200); // max is 100

    await request(app)
      .post(`/api/businesses/${businessId}/assets`)
      .send({
        name: longName,
        brand: "Brand",
        model: "Model",
        serialNumber: "SN-1",
        purchaseDate: "2025-01-01",
      })
      .expect(400);
  });

  it("rejects missing required fields", async () => {
    await request(app)
      .post(`/api/businesses/${businessId}/assets`)
      .send({ name: "Only name" })
      .expect(400);
  });

  it("rejects invalid date format", async () => {
    await request(app)
      .post(`/api/businesses/${businessId}/assets`)
      .send({
        name: "Asset",
        brand: "Brand",
        model: "Model",
        serialNumber: "SN-2",
        purchaseDate: "not-a-date",
      })
      .expect(400);
  });

  it("rejects invalid UUID in session start", async () => {
    await request(app)
      .post(`/api/businesses/${businessId}/sessions`)
      .send({ assetId: "not-a-uuid" })
      .expect(400);
  });

  it("rejects invalid business code format", async () => {
    await request(app)
      .post("/api/businesses/join")
      .send({ businessCode: "INVALID" })
      .expect(400);
  });

  it("rejects invalid maintenance trigger type", async () => {
    await request(app)
      .post(`/api/businesses/${businessId}/maintenance/schedules`)
      .send({
        title: "Schedule",
        assetId: "00000000-0000-0000-0000-000000000000",
        triggerType: "invalid_type",
      })
      .expect(400);
  });

  it("rejects usage_hours schedule without intervalHours", async () => {
    await request(app)
      .post(`/api/businesses/${businessId}/maintenance/schedules`)
      .send({
        title: "Schedule",
        assetId: "00000000-0000-0000-0000-000000000000",
        triggerType: "usage_hours",
        // missing intervalHours
      })
      .expect(400);
  });

  it("rejects report with invalid severity", async () => {
    await request(app)
      .post(`/api/businesses/${businessId}/reports`)
      .send({
        title: "Report",
        description: "Desc",
        severity: "super_critical",
        assetId: "00000000-0000-0000-0000-000000000000",
      })
      .expect(400);
  });

  it("SQL injection attempt in asset name is safely handled", async () => {
    const res = await request(app)
      .post(`/api/businesses/${businessId}/assets`)
      .send({
        name: "'; DROP TABLE assets; --",
        brand: "Brand",
        model: "Model",
        serialNumber: "SN-SQL-1",
        purchaseDate: "2025-01-01",
      })
      .expect(201);

    // Prisma parameterized queries prevent SQL injection — name stored as-is
    expect(res.body.name).toBe("'; DROP TABLE assets; --");
  });
});
