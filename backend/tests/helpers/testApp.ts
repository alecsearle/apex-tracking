import express from "express";
import cors from "cors";
import routes from "../../src/routes/index";
import { errorHandler } from "../../src/middleware/errorHandler";
import { NotFoundError } from "../../src/utils/errors";

/**
 * Create a fresh Express app for testing (no server.listen).
 * Uses the real route tree with real middleware.
 */
export function createTestApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use("/api", routes);

  // 404 handler
  app.use((_req: express.Request, _res: express.Response) => {
    throw new NotFoundError("Route not found");
  });

  // Error handler
  app.use(errorHandler);

  return app;
}
