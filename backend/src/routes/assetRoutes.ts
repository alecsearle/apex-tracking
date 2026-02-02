import express from "express";
import { assetController } from "../controllers/assetController";

const router = express.Router();

// Base path: /api/assets
router.get("/", assetController.getAll);
router.get("/:id", assetController.getById);
router.post("/", assetController.create);
router.put("/:id", assetController.update);
router.delete("/:id", assetController.delete);

export default router;
