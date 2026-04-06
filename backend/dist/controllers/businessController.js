"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessController = void 0;
const businessService_1 = require("../services/businessService");
const params_1 = require("../utils/params");
exports.businessController = {
    async createBusiness(req, res) {
        const business = await businessService_1.businessService.createBusiness(req.user.id, req.body.name);
        res.status(201).json(business);
    },
    async getBusiness(req, res) {
        const business = await businessService_1.businessService.getBusiness(req.membership.businessId);
        res.json(business);
    },
    async updateBusiness(req, res) {
        const business = await businessService_1.businessService.updateBusiness(req.membership.businessId, req.body);
        res.json(business);
    },
    async getMembers(req, res) {
        const members = await businessService_1.businessService.getMembers(req.membership.businessId);
        res.json(members);
    },
    async removeMember(req, res) {
        await businessService_1.businessService.removeMember(req.membership.businessId, (0, params_1.param)(req.params.userId), req.user.id);
        res.status(204).send();
    },
    async joinBusiness(req, res) {
        const result = await businessService_1.businessService.joinBusiness(req.user.id, req.body.businessCode);
        res.status(201).json(result);
    },
};
