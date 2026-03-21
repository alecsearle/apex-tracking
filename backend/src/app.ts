import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index";
import { errorHandler } from "./middleware/errorHandler";
import { NotFoundError } from "./utils/errors";

const app = express();

// Security headers
app.use(helmet());

// CORS — configure for frontend origin in production
app.use(cors({ origin: "*" }));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", routes);

// Root endpoint
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Apex Tracking API",
    version: "2.0.0",
    status: "running",
  });
});

// 404 handler for unmatched routes
app.use((_req: Request, _res: Response) => {
  throw new NotFoundError("Route not found");
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
