import { Request, Response } from "express";
import { businessService } from "../services/businessService";
import { param } from "../utils/params";

export const businessController = {
  async createBusiness(req: Request, res: Response): Promise<void> {
    const business = await businessService.createBusiness(req.user!.id, req.body.name);
    res.status(201).json(business);
  },

  async getBusiness(req: Request, res: Response): Promise<void> {
    const business = await businessService.getBusiness(req.membership!.businessId);
    res.json(business);
  },

  async updateBusiness(req: Request, res: Response): Promise<void> {
    const business = await businessService.updateBusiness(
      req.membership!.businessId,
      req.body
    );
    res.json(business);
  },

  async getMembers(req: Request, res: Response): Promise<void> {
    const members = await businessService.getMembers(req.membership!.businessId);
    res.json(members);
  },

  async removeMember(req: Request, res: Response): Promise<void> {
    await businessService.removeMember(
      req.membership!.businessId,
      param(req.params.userId),
      req.user!.id
    );
    res.status(204).send();
  },

  async joinBusiness(req: Request, res: Response): Promise<void> {
    const result = await businessService.joinBusiness(
      req.user!.id,
      req.body.businessCode
    );
    res.status(201).json(result);
  },
};
