import request from "supertest";
import { setupTestDb, teardownTestDb } from "../helpers/testDb";
import { createAuthenticatedTestApp } from "../helpers/testAppWithAuth";
import { createTestBusinessWithOwner, createTestAsset, createTestUser, createTestMembership } from "../helpers/factories";

let appA: ReturnType<typeof createAuthenticatedTestApp>;
let appB: ReturnType<typeof createAuthenticatedTestApp>;
let businessAId: string;
let businessBId: string;
let ownerAId: string;
let ownerBId: string;

beforeAll(async () => {
  await setupTestDb();

  // Business A
  const a = await createTestBusinessWithOwner();
  businessAId = a.business.id;
  ownerAId = a.owner.id;
  appA = createAuthenticatedTestApp({
    userId: a.owner.id,
    email: a.owner.email,
    businessId: a.business.id,
    role: "owner",
  });

  // Business B
  const b = await createTestBusinessWithOwner();
  businessBId = b.business.id;
  ownerBId = b.owner.id;
  appB = createAuthenticatedTestApp({
    userId: b.owner.id,
    email: b.owner.email,
    businessId: b.business.id,
    role: "owner",
  });
});

afterAll(async () => {
  await teardownTestDb();
});

describe("Business Isolation", () => {
  it("Business A user cannot see Business B assets", async () => {
    const assetB = await createTestAsset(businessBId, ownerBId);

    // User A tries to access asset from Business B
    const res = await request(appA)
      .get(`/api/businesses/${businessAId}/assets/${assetB.id}`)
      .expect(404);

    expect(res.body.code).toBe("NOT_FOUND");
  });

  it("Business A assets list does not include Business B assets", async () => {
    await createTestAsset(businessAId, ownerAId, { name: "Asset A" });
    await createTestAsset(businessBId, ownerBId, { name: "Asset B" });

    const resA = await request(appA)
      .get(`/api/businesses/${businessAId}/assets`)
      .expect(200);

    const names = resA.body.map((a: { name: string }) => a.name);
    expect(names).toContain("Asset A");
    expect(names).not.toContain("Asset B");
  });

  it("Business A user cannot start session on Business B asset", async () => {
    const assetB = await createTestAsset(businessBId, ownerBId);

    await request(appA)
      .post(`/api/businesses/${businessAId}/sessions`)
      .send({ assetId: assetB.id })
      .expect(404);
  });

  it("Business A user cannot see Business B SOPs", async () => {
    // Create SOP in Business B
    await request(appB)
      .post(`/api/businesses/${businessBId}/sops`)
      .send({ title: "Secret SOP", content: "Confidential" })
      .expect(201);

    // Business A tries to list SOPs — should not see Business B's
    const res = await request(appA)
      .get(`/api/businesses/${businessAId}/sops`)
      .expect(200);

    const titles = res.body.map((s: { title: string }) => s.title);
    expect(titles).not.toContain("Secret SOP");
  });

  it("Business A user cannot see Business B reports", async () => {
    const assetB = await createTestAsset(businessBId, ownerBId);

    await request(appB)
      .post(`/api/businesses/${businessBId}/reports`)
      .send({
        title: "Secret Report",
        description: "Hidden",
        severity: "low",
        assetId: assetB.id,
      })
      .expect(201);

    const res = await request(appA)
      .get(`/api/businesses/${businessAId}/reports`)
      .expect(200);

    const titles = res.body.map((r: { title: string }) => r.title);
    expect(titles).not.toContain("Secret Report");
  });

  it("Business A user cannot access Business B maintenance schedules", async () => {
    const assetB = await createTestAsset(businessBId, ownerBId);

    await request(appB)
      .post(`/api/businesses/${businessBId}/maintenance/schedules`)
      .send({
        title: "B Only Schedule",
        assetId: assetB.id,
        triggerType: "time_interval",
        intervalDays: 30,
      })
      .expect(201);

    const res = await request(appA)
      .get(`/api/businesses/${businessAId}/maintenance/schedules`)
      .expect(200);

    const titles = res.body.map((s: { title: string }) => s.title);
    expect(titles).not.toContain("B Only Schedule");
  });
});
