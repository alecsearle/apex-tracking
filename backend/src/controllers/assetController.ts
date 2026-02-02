import { Request, Response } from "express";
import { assetService } from "../services/assetService";

export const assetController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const assets = await assetService.getAll();
      res.json(assets);
    } catch (error) {
      console.error("Error fetching assets:", error);
      res.status(500).json({ error: "Failed to fetch assets" });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const asset = await assetService.getById(id);

      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }

      res.json(asset);
    } catch (error) {
      console.error("Error fetching asset:", error);
      res.status(500).json({ error: "Failed to fetch asset" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const assetData = req.body;

      // Basic validation
      if (
        !assetData.name ||
        !assetData.brand ||
        !assetData.model ||
        !assetData.serialNumber ||
        !assetData.purchaseDate
      ) {
        return res.status(400).json({
          error: "Missing required fields",
          required: ["name", "brand", "model", "serialNumber", "purchaseDate"],
        });
      }

      const newAsset = await assetService.create(assetData);
      res.status(201).json(newAsset);
    } catch (error) {
      console.error("Error creating asset:", error);
      res.status(500).json({ error: "Failed to create asset" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const updates = req.body;

      // Check if updates object is empty
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No updates provided" });
      }

      const updatedAsset = await assetService.update(id, updates);

      if (!updatedAsset) {
        return res.status(404).json({ error: "Asset not found" });
      }

      res.json(updatedAsset);
    } catch (error) {
      console.error("Error updating asset:", error);
      res.status(500).json({ error: "Failed to update asset" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const deleted = await assetService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Asset not found" });
      }

      res.status(204).send(); // 204 = No Content (successful deletion)
    } catch (error) {
      console.error("Error deleting asset:", error);
      res.status(500).json({ error: "Failed to delete asset" });
    }
  },
};
