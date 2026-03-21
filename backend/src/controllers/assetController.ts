import { Request, Response } from "express";
import { assetService } from "../services/assetService";
import { param } from "../utils/params";

export const assetController = {
  async getAll(req: Request, res: Response): Promise<void> {
    const assets = await assetService.getAll(req.membership!.businessId);
    res.json(assets);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const asset = await assetService.getById(
      req.membership!.businessId,
      param(req.params.id)
    );
    res.json(asset);
  },

  async create(req: Request, res: Response): Promise<void> {
    const asset = await assetService.create(
      req.membership!.businessId,
      req.body,
      req.user!.id
    );
    res.status(201).json(asset);
  },

  async update(req: Request, res: Response): Promise<void> {
    const asset = await assetService.update(
      req.membership!.businessId,
      param(req.params.id),
      req.body
    );
    res.json(asset);
  },

  async delete(req: Request, res: Response): Promise<void> {
    await assetService.delete(req.membership!.businessId, param(req.params.id));
    res.status(204).send();
  },

  async uploadPhoto(req: Request, res: Response): Promise<void> {
    const file = req.file!;
    const asset = await assetService.uploadPhoto(
      req.membership!.businessId,
      param(req.params.id),
      file.buffer,
      file.mimetype
    );
    res.json(asset);
  },

  async deletePhoto(req: Request, res: Response): Promise<void> {
    await assetService.deletePhoto(req.membership!.businessId, param(req.params.id));
    res.status(204).send();
  },

  async uploadManual(req: Request, res: Response): Promise<void> {
    const file = req.file!;
    const asset = await assetService.uploadManual(
      req.membership!.businessId,
      param(req.params.id),
      file.buffer,
      file.mimetype
    );
    res.json(asset);
  },

  async deleteManual(req: Request, res: Response): Promise<void> {
    await assetService.deleteManual(req.membership!.businessId, param(req.params.id));
    res.status(204).send();
  },
};
