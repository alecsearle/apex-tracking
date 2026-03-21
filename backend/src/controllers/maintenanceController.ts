import { Request, Response } from "express";
import { maintenanceService } from "../services/maintenanceService";
import { param } from "../utils/params";

export const maintenanceController = {
  async getSchedules(req: Request, res: Response): Promise<void> {
    const assetId = (param(req.params.assetId) || req.query.assetId) as string | undefined;
    const schedules = await maintenanceService.getSchedules(
      req.membership!.businessId,
      assetId
    );
    res.json(schedules);
  },

  async getScheduleById(req: Request, res: Response): Promise<void> {
    const schedule = await maintenanceService.getScheduleById(
      req.membership!.businessId,
      param(req.params.id)
    );
    res.json(schedule);
  },

  async createSchedule(req: Request, res: Response): Promise<void> {
    const schedule = await maintenanceService.createSchedule(
      req.membership!.businessId,
      req.body,
      req.user!.id
    );
    res.status(201).json(schedule);
  },

  async updateSchedule(req: Request, res: Response): Promise<void> {
    const schedule = await maintenanceService.updateSchedule(
      req.membership!.businessId,
      param(req.params.id),
      req.body
    );
    res.json(schedule);
  },

  async deleteSchedule(req: Request, res: Response): Promise<void> {
    await maintenanceService.deleteSchedule(
      req.membership!.businessId,
      param(req.params.id)
    );
    res.status(204).send();
  },

  async completeSchedule(req: Request, res: Response): Promise<void> {
    const log = await maintenanceService.completeSchedule(
      req.membership!.businessId,
      param(req.params.id),
      req.user!.id,
      req.body
    );
    res.status(201).json(log);
  },

  async getLogs(req: Request, res: Response): Promise<void> {
    const logs = await maintenanceService.getLogs(
      req.membership!.businessId,
      param(req.params.id)
    );
    res.json(logs);
  },

  async getDueSchedules(req: Request, res: Response): Promise<void> {
    const due = await maintenanceService.getDueSchedules(
      req.membership!.businessId
    );
    res.json(due);
  },

  async addLogPhoto(req: Request, res: Response): Promise<void> {
    const file = req.file!;
    const photo = await maintenanceService.addLogPhoto(
      req.membership!.businessId,
      param(req.params.logId),
      file.buffer,
      file.mimetype
    );
    res.status(201).json(photo);
  },

  async deleteLogPhoto(req: Request, res: Response): Promise<void> {
    await maintenanceService.deleteLogPhoto(
      req.membership!.businessId,
      param(req.params.logId),
      param(req.params.photoId)
    );
    res.status(204).send();
  },
};
