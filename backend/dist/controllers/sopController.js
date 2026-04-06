"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sopController = void 0;
const sopService_1 = require("../services/sopService");
const params_1 = require("../utils/params");
exports.sopController = {
    async getAll(req, res) {
        const assetId = req.query.assetId;
        const sops = await sopService_1.sopService.getAll(req.membership.businessId, assetId);
        res.json(sops);
    },
    async getById(req, res) {
        const sop = await sopService_1.sopService.getById(req.membership.businessId, (0, params_1.param)(req.params.id));
        res.json(sop);
    },
    async create(req, res) {
        const sop = await sopService_1.sopService.create(req.membership.businessId, req.body, req.user.id);
        res.status(201).json(sop);
    },
    async update(req, res) {
        const sop = await sopService_1.sopService.update(req.membership.businessId, (0, params_1.param)(req.params.id), req.body);
        res.json(sop);
    },
    async delete(req, res) {
        await sopService_1.sopService.delete(req.membership.businessId, (0, params_1.param)(req.params.id));
        res.status(204).send();
    },
};
