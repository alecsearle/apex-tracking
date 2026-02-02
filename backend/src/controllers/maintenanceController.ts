import { Request, Response } from "express";
import { maintenanceService } from "../services/maintenanceService";

export const maintenanceController = {
  // Get all maintenance records
  getAll: async (req: Request, res: Response) => {
    try {
      const records = await maintenanceService.getAll();
      res.json(records);
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
      res.status(500).json({ error: "Failed to fetch maintenance records" });
    }
  },

  // Get maintenance record for specific asset
  getByAssetId: async (req: Request, res: Response) => {
    try {
      const assetId = req.params.assetId as string;
      const records = await maintenanceService.getByAssetId(assetId);
      res.json(records);
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
      res.status(500).json({ error: "Failed to fetch maintenance records" });
    }
  },

  // Get single maintenance record by ID
  getById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const record = await maintenanceService.getById(id);

      if (!record) {
        return res.status(404).json({ error: "Maintenance record not found" });
      }

      res.json(record);
    } catch (error) {
      console.error("Error fetching maintenance record:", error);
      res.status(500).json({ error: "Failed to fetch maintenance record" });
    }
  },

  // Create a new maintenance record
  create: async (req: Request, res: Response) => {
    try {
      const recordData = req.body;

      // Validate required fields
      if (!recordData.assetId || !recordData.date || !recordData.task) {
        return res.status(400).json({
          error: "Missing required fields",
          required: ["assetId", "date", "task"],
        });
      }

      const newRecord = await maintenanceService.create(recordData);
      res.status(201).json(newRecord);
    } catch (error) {
      console.error("Error creating maintenance record:", error);
      res.status(500).json({ error: "Failed to create maintenance record" });
    }
  },

  // Update a maintenance record
  update: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const updates = req.body;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No updates provided" });
      }

      const updatedRecord = await maintenanceService.update(id, updates);

      if (!updatedRecord) {
        return res.status(404).json({ error: "Maintenance record not found" });
      }

      res.json(updatedRecord);
    } catch (error) {
      console.error("Error updating maintenance record:", error);
      res.status(500).json({ error: "Failed to update maintenance record" });
    }
  },

  // Delete a maintenance record
  delete: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const deleted = await maintenanceService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Maintenance record not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting maintenance record:", error);
      res.status(500).json({ error: "Failed to delete maintenance record" });
    }
  },
};
