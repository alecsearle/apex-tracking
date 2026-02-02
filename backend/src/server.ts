import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import assetRoutes from "./routes/assetRoutes";
import maintenanceRoutes from "./routes/maintenanceRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Apex Tracking API",
    version: "1.0.0",
    status: "running",
  });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Asset Routes
app.use("/api/assets", assetRoutes);
app.use("/api/maintenance", maintenanceRoutes);

// Start Server
app.listen(port, () => {
  (console.log(`Server is running on port ${port}`), console.log(`http://localhost:${port}`));
});
