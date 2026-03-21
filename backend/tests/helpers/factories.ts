import { testPrisma } from "./testDb";

let userCounter = 0;
let businessCounter = 0;

export async function createTestUser(overrides?: {
  id?: string;
  email?: string;
  fullName?: string;
}) {
  userCounter++;
  return testPrisma.user.create({
    data: {
      id: overrides?.id || `test-user-${userCounter}-${Date.now()}`,
      email: overrides?.email || `user${userCounter}-${Date.now()}@test.com`,
      fullName: overrides?.fullName || `Test User ${userCounter}`,
    },
  });
}

export async function createTestBusiness(overrides?: {
  name?: string;
  businessCode?: string;
}) {
  businessCounter++;
  return testPrisma.business.create({
    data: {
      name: overrides?.name || `Test Business ${businessCounter}`,
      businessCode: overrides?.businessCode || `APEX-T${String(businessCounter).padStart(3, "0")}`,
    },
  });
}

export async function createTestMembership(
  userId: string,
  businessId: string,
  role: "owner" | "employee" = "employee"
) {
  return testPrisma.membership.create({
    data: { userId, businessId, role },
  });
}

export async function createTestAsset(
  businessId: string,
  createdBy: string,
  overrides?: {
    name?: string;
    serialNumber?: string;
    status?: "available" | "in_use" | "maintenance";
  }
) {
  return testPrisma.asset.create({
    data: {
      businessId,
      createdBy,
      name: overrides?.name || "Test Asset",
      brand: "Test Brand",
      model: "Test Model",
      serialNumber: overrides?.serialNumber || `SN-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      purchaseDate: new Date("2025-01-01"),
      status: overrides?.status || "available",
    },
  });
}

export async function createTestSession(
  assetId: string,
  startedBy: string,
  overrides?: { status?: "active" | "completed"; jobSiteName?: string }
) {
  return testPrisma.usageSession.create({
    data: {
      assetId,
      startedBy,
      status: overrides?.status || "active",
      jobSiteName: overrides?.jobSiteName,
      endedAt: overrides?.status === "completed" ? new Date() : undefined,
      endedBy: overrides?.status === "completed" ? startedBy : undefined,
    },
  });
}

/**
 * Create a full test setup: business, owner user, owner membership.
 * Returns { business, owner, membership }.
 */
export async function createTestBusinessWithOwner() {
  const owner = await createTestUser();
  const business = await createTestBusiness();
  const membership = await createTestMembership(owner.id, business.id, "owner");
  return { business, owner, membership };
}

/**
 * Create a second business with its own owner for isolation tests.
 */
export async function createTestBusinessB() {
  const owner = await createTestUser();
  const business = await createTestBusiness();
  const membership = await createTestMembership(owner.id, business.id, "owner");
  return { business, owner, membership };
}
