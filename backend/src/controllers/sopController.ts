import { Request, Response } from "express";
import { sopService } from "../services/sopService";
import { param } from "../utils/params";

export const sopController = {
  async getAll(req: Request, res: Response): Promise<void> {
    const assetId = req.query.assetId as string | undefined;
    const sops = await sopService.getAll(req.membership!.businessId, assetId);
    res.json(sops);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const sop = await sopService.getById(req.membership!.businessId, param(req.params.id));
    res.json(sop);
  },

  async create(req: Request, res: Response): Promise<void> {
    const sop = await sopService.create(
      req.membership!.businessId,
      req.body,
      req.user!.id
    );
    res.status(201).json(sop);
  },

  async update(req: Request, res: Response): Promise<void> {
    const sop = await sopService.update(
      req.membership!.businessId,
      param(req.params.id),
      req.body
    );
    res.json(sop);
  },

  async delete(req: Request, res: Response): Promise<void> {
    await sopService.delete(req.membership!.businessId, param(req.params.id));
    res.status(204).send();
  },
};
