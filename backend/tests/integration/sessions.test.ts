import request from "supertest";
import { setupTestDb, teardownTestDb, testPrisma } from "../helpers/testDb";
import { createAuthenticatedTestApp } from "../helpers/testAppWithAuth";
import { createTestBusinessWithOwner, createTestUser, createTestMembership, createTestAsset } from "../helpers/factories";

let app: ReturnType<typeof createAuthenticatedTestApp>;
let businessId: string;
let ownerId: string;

beforeAll(async () => {
  await setupTestDb();
});

afterAll(async () => {
  await teardownTestDb();
});

beforeEach(async () => {
  const { business, owner } = await createTestBusinessWithOwner();
  businessId = business.id;
  ownerId = owner.id;

  app = createAuthenticatedTestApp({
    userId: owner.id,
    email: owner.email,
    businessId: business.id,
    role: "owner",
  });
});

describe("Session start/end logic", () => {
  it("start session on available asset → 201, asset becomes in_use", async () => {
    const asset = await createTestAsset(businessId, ownerId);

    const res = await request(app)
      .post(`/api/businesses/${businessId}/sessions`)
      .send({ assetId: asset.id, jobSiteName: "Site A" })
      .expect(201);

    expect(res.body.status).toBe("active");
    expect(res.body.assetName).toBe(asset.name);
    expect(res.body.jobSiteName).toBe("Site A");

    // Verify asset status changed
    const updated = await testPrisma.asset.findUnique({ where: { id: asset.id } });
    expect(updated?.status).toBe("in_use");
  });

  it("start session on in_use asset → 409 conflict", async () => {
    const asset = await createTestAsset(businessId, ownerId, { status: "in_use" });
    // Create an active session for it
    await testPrisma.usageSession.create({
      data: { assetId: asset.id, startedBy: ownerId, status: "active" },
    });

    await request(app)
      .post(`/api/businesses/${businessId}/sessions`)
      .send({ assetId: asset.id })
      .expect(409);
  });

  it("start session on maintenance asset → 409 conflict", async () => {
    const asset = await createTestAsset(businessId, ownerId, { status: "maintenance" });

    await request(app)
      .post(`/api/businesses/${businessId}/sessions`)
      .send({ assetId: asset.id })
      .expect(409);
  });

  it("end session → 200, asset becomes available", async () => {
    const asset = await createTestAsset(businessId, ownerId);

    // Start session
    const startRes = await request(app)
      .post(`/api/businesses/${businessId}/sessions`)
      .send({ assetId: asset.id })
      .expect(201);

    // End session with totalPausedMs
    const endRes = await request(app)
      .put(`/api/businesses/${businessId}/sessions/${startRes.body.id}/end`)
      .send({ notes: "Done", totalPausedMs: 5000 })
      .expect(200);

    expect(endRes.body.status).toBe("completed");
    expect(endRes.body.endedAt).toBeDefined();
    expect(endRes.body.totalPausedMs).toBe(5000);

    // Verify asset status
    const updated = await testPrisma.asset.findUnique({ where: { id: asset.id } });
    expect(updated?.status).toBe("available");
  });

  it("end already-ended session → 409", async () => {
    const asset = await createTestAsset(businessId, ownerId);

    const startRes = await request(app)
      .post(`/api/businesses/${businessId}/sessions`)
      .send({ assetId: asset.id })
      .expect(201);

    await request(app)
      .put(`/api/businesses/${businessId}/sessions/${startRes.body.id}/end`)
      .send({})
      .expect(200);

    // Try ending again
    await request(app)
      .put(`/api/businesses/${businessId}/sessions/${startRes.body.id}/end`)
      .send({})
      .expect(409);
  });

  it("GET active sessions returns only active", async () => {
    const asset1 = await createTestAsset(businessId, ownerId);
    const asset2 = await createTestAsset(businessId, ownerId);

    // Start two sessions
    await request(app).post(`/api/businesses/${businessId}/sessions`).send({ assetId: asset1.id }).expect(201);
    const s2 = await request(app).post(`/api/businesses/${businessId}/sessions`).send({ assetId: asset2.id }).expect(201);

    // End one
    await request(app).put(`/api/businesses/${businessId}/sessions/${s2.body.id}/end`).send({}).expect(200);

    const res = await request(app)
      .get(`/api/businesses/${businessId}/sessions/active`)
      .expect(200);

    expect(res.body).toHaveLength(1);
    expect(res.body[0].assetId).toBe(asset1.id);
  });

  it("GET asset sessions returns all sessions for asset", async () => {
    const asset = await createTestAsset(businessId, ownerId);

    const s1 = await request(app).post(`/api/businesses/${businessId}/sessions`).send({ assetId: asset.id }).expect(201);
    await request(app).put(`/api/businesses/${businessId}/sessions/${s1.body.id}/end`).send({}).expect(200);
    await request(app).post(`/api/businesses/${businessId}/sessions`).send({ assetId: asset.id }).expect(201);

    const res = await request(app)
      .get(`/api/businesses/${businessId}/assets/${asset.id}/sessions`)
      .expect(200);

    expect(res.body).toHaveLength(2);
  });
});
