"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetController = void 0;
const assetService_1 = require("../services/assetService");
const errors_1 = require("../utils/errors");
const params_1 = require("../utils/params");
exports.assetController = {
    async getAll(req, res) {
        const assets = await assetService_1.assetService.getAll(req.membership.businessId);
        res.json(assets);
    },
    async getById(req, res) {
        const asset = await assetService_1.assetService.getById(req.membership.businessId, (0, params_1.param)(req.params.id));
        res.json(asset);
    },
    async create(req, res) {
        const asset = await assetService_1.assetService.create(req.membership.businessId, req.body, req.user.id);
        res.status(201).json(asset);
    },
    async update(req, res) {
        const asset = await assetService_1.assetService.update(req.membership.businessId, (0, params_1.param)(req.params.id), req.body);
        res.json(asset);
    },
    async delete(req, res) {
        await assetService_1.assetService.delete(req.membership.businessId, (0, params_1.param)(req.params.id));
        res.status(204).send();
    },
    async uploadPhoto(req, res) {
        if (!req.file)
            throw new errors_1.ValidationError("No photo file provided");
        const asset = await assetService_1.assetService.uploadPhoto(req.membership.businessId, (0, params_1.param)(req.params.id), req.file.buffer, req.file.mimetype);
        res.json(asset);
    },
    async deletePhoto(req, res) {
        await assetService_1.assetService.deletePhoto(req.membership.businessId, (0, params_1.param)(req.params.id));
        res.status(204).send();
    },
    async uploadManual(req, res) {
        if (!req.file)
            throw new errors_1.ValidationError("No PDF file provided");
        const asset = await assetService_1.assetService.uploadManual(req.membership.businessId, (0, params_1.param)(req.params.id), req.file.buffer, req.file.mimetype);
        res.json(asset);
    },
    async deleteManual(req, res) {
        await assetService_1.assetService.deleteManual(req.membership.businessId, (0, params_1.param)(req.params.id));
        res.status(204).send();
    },
};
