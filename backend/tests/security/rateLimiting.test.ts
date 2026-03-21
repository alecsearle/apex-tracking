import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import { generalLimiter } from "../../src/middleware/rateLimiter";
import { errorHandler } from "../../src/middleware/errorHandler";

describe("Rate limiting", () => {
  it("returns 429 when general rate limit exceeded (100 req/min)", async () => {
    // Create a minimal app with the general limiter on a simple endpoint
    const app = express();
    app.use(generalLimiter);
    app.get("/test", (_req: Request, res: Response) => res.json({ ok: true }));
    app.use(errorHandler);

    // Send 101 requests — 101st should be rate limited
    for (let i = 0; i < 100; i++) {
      await request(app).get("/test");
    }

    const res = await request(app).get("/test");
    expect(res.status).toBe(429);
    expect(res.body.code).toBe("RATE_LIMITED");
  });

  it("includes rate limit headers", async () => {
    const app = express();
    app.use(generalLimiter);
    app.get("/test", (_req: Request, res: Response) => res.json({ ok: true }));

    const res = await request(app).get("/test");

    expect(res.headers["ratelimit-limit"]).toBeDefined();
    expect(res.headers["ratelimit-remaining"]).toBeDefined();
  });
});
