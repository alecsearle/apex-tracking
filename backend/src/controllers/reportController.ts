import { Request, Response } from "express";
import { reportService } from "../services/reportService";
import { param } from "../utils/params";

export const reportController = {
  async getAll(req: Request, res: Response): Promise<void> {
    const filters = {
      assetId: req.query.assetId as string | undefined,
      severity: req.query.severity as string | undefined,
      status: req.query.status as string | undefined,
    };
    const reports = await reportService.getAll(req.membership!.businessId, filters);
    res.json(reports);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const report = await reportService.getById(
      req.membership!.businessId,
      param(req.params.id)
    );
    res.json(report);
  },

  async create(req: Request, res: Response): Promise<void> {
    const report = await reportService.create(
      req.membership!.businessId,
      req.body,
      req.user!.id
    );
    res.status(201).json(report);
  },

  async update(req: Request, res: Response): Promise<void> {
    const report = await reportService.update(
      req.membership!.businessId,
      param(req.params.id),
      req.body
    );
    res.json(report);
  },

  async addPhoto(req: Request, res: Response): Promise<void> {
    const file = req.file!;
    const photo = await reportService.addPhoto(
      req.membership!.businessId,
      param(req.params.id),
      file.buffer,
      file.mimetype
    );
    res.status(201).json(photo);
  },

  async deletePhoto(req: Request, res: Response): Promise<void> {
    await reportService.deletePhoto(
      req.membership!.businessId,
      param(req.params.id),
      param(req.params.photoId)
    );
    res.status(204).send();
  },
};
