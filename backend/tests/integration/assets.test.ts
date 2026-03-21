import request from "supertest";
import { setupTestDb, teardownTestDb } from "../helpers/testDb";
import { createAuthenticatedTestApp } from "../helpers/testAppWithAuth";
import { createTestBusinessWithOwner, createTestUser, createTestMembership, createTestAsset } from "../helpers/factories";

let ownerApp: ReturnType<typeof createAuthenticatedTestApp>;
let employeeApp: ReturnType<typeof createAuthenticatedTestApp>;
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

  ownerApp = createAuthenticatedTestApp({
    userId: owner.id,
    email: owner.email,
    businessId: business.id,
    role: "owner",
  });

  const employee = await createTestUser();
  await createTestMembership(employee.id, business.id, "employee");

  employeeApp = createAuthenticatedTestApp({
    userId: employee.id,
    email: employee.email,
    businessId: business.id,
    role: "employee",
  });
});

describe("Asset CRUD", () => {
  const validAsset = {
    name: "Excavator",
    brand: "CAT",
    model: "320F",
    serialNumber: "EX-001",
    purchaseDate: "2025-01-15",
  };

  it("GET /assets returns empty array initially", async () => {
    const res = await request(ownerApp)
      .get(`/api/businesses/${businessId}/assets`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /assets as owner → 201", async () => {
    const res = await request(ownerApp)
      .post(`/api/businesses/${businessId}/assets`)
      .send(validAsset)
      .expect(201);

    expect(res.body.name).toBe("Excavator");
    expect(res.body.businessId).toBe(businessId);
    expect(res.body.createdBy).toBe(ownerId);
    expect(res.body.status).toBe("available");
    expect(res.body.totalUsageHours).toBe(0);
  });

  it("POST /assets as employee → 201 (employees can create)", async () => {
    const res = await request(employeeApp)
      .post(`/api/businesses/${businessId}/assets`)
      .send({ ...validAsset, serialNumber: "EX-EMP-001" })
      .expect(201);

    expect(res.body.name).toBe("Excavator");
  });

  it("GET /assets/:id returns asset with totalUsageHours", async () => {
    const created = await createTestAsset(businessId, ownerId);

    const res = await request(ownerApp)
      .get(`/api/businesses/${businessId}/assets/${created.id}`)
      .expect(200);

    expect(res.body.id).toBe(created.id);
    expect(typeof res.body.totalUsageHours).toBe("number");
  });

  it("PUT /assets/:id as owner → 200", async () => {
    const created = await createTestAsset(businessId, ownerId);

    const res = await request(ownerApp)
      .put(`/api/businesses/${businessId}/assets/${created.id}`)
      .send({ name: "Updated Excavator" })
      .expect(200);

    expect(res.body.name).toBe("Updated Excavator");
  });

  it("PUT /assets/:id as employee → 403", async () => {
    const created = await createTestAsset(businessId, ownerId);

    await request(employeeApp)
      .put(`/api/businesses/${businessId}/assets/${created.id}`)
      .send({ name: "Hacked" })
      .expect(403);
  });

  it("DELETE /assets/:id as owner → 204", async () => {
    const created = await createTestAsset(businessId, ownerId);

    await request(ownerApp)
      .delete(`/api/businesses/${businessId}/assets/${created.id}`)
      .expect(204);

    // Verify deleted
    await request(ownerApp)
      .get(`/api/businesses/${businessId}/assets/${created.id}`)
      .expect(404);
  });

  it("DELETE /assets/:id as employee → 403", async () => {
    const created = await createTestAsset(businessId, ownerId);

    await request(employeeApp)
      .delete(`/api/businesses/${businessId}/assets/${created.id}`)
      .expect(403);
  });

  it("POST /assets with duplicate serialNumber → 409", async () => {
    await request(ownerApp)
      .post(`/api/businesses/${businessId}/assets`)
      .send(validAsset)
      .expect(201);

    await request(ownerApp)
      .post(`/api/businesses/${businessId}/assets`)
      .send(validAsset)
      .expect(409);
  });

  it("POST /assets with missing required fields → 400", async () => {
    await request(ownerApp)
      .post(`/api/businesses/${businessId}/assets`)
      .send({ name: "Only name" })
      .expect(400);
  });
});
