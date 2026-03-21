import "express";

declare module "express" {
  interface Request {
    user?: { id: string; email: string };
    membership?: { businessId: string; role: "owner" | "employee" };
  }
}
