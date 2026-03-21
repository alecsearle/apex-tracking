import { Request, Response, NextFunction } from "express";
import { authorize } from "../../src/middleware/authorize";
import { ForbiddenError } from "../../src/utils/errors";

function mockReq(membership?: { businessId: string; role: "owner" | "employee" }): Request {
  return { membership } as unknown as Request;
}

const mockRes = {} as Response;

describe("authorize middleware", () => {
  it("passes when user has required role (owner)", () => {
    const next = jest.fn() as NextFunction;
    authorize("owner")(mockReq({ businessId: "b1", role: "owner" }), mockRes, next);
    expect(next).toHaveBeenCalled();
  });

  it("passes when user has required role (employee)", () => {
    const next = jest.fn() as NextFunction;
    authorize("employee")(mockReq({ businessId: "b1", role: "employee" }), mockRes, next);
    expect(next).toHaveBeenCalled();
  });

  it("passes when multiple roles accepted and user has one", () => {
    const next = jest.fn() as NextFunction;
    authorize("owner", "employee")(mockReq({ businessId: "b1", role: "employee" }), mockRes, next);
    expect(next).toHaveBeenCalled();
  });

  it("throws ForbiddenError when employee tries owner-only route", () => {
    const next = jest.fn() as NextFunction;
    expect(() => {
      authorize("owner")(mockReq({ businessId: "b1", role: "employee" }), mockRes, next);
    }).toThrow(ForbiddenError);
    expect(next).not.toHaveBeenCalled();
  });

  it("throws ForbiddenError when no membership on request", () => {
    const next = jest.fn() as NextFunction;
    expect(() => {
      authorize("owner")(mockReq(), mockRes, next);
    }).toThrow(ForbiddenError);
    expect(next).not.toHaveBeenCalled();
  });
});
