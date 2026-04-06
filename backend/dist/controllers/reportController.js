"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportController = void 0;
const reportService_1 = require("../services/reportService");
const params_1 = require("../utils/params");
exports.reportController = {
    async getAll(req, res) {
        const filters = {
            assetId: req.query.assetId,
            severity: req.query.severity,
            status: req.query.status,
        };
        const reports = await reportService_1.reportService.getAll(req.membership.businessId, filters);
        res.json(reports);
    },
    async getById(req, res) {
        const report = await reportService_1.reportService.getById(req.membership.businessId, (0, params_1.param)(req.params.id));
        res.json(report);
    },
    async create(req, res) {
        const report = await reportService_1.reportService.create(req.membership.businessId, req.body, req.user.id);
        res.status(201).json(report);
    },
    async update(req, res) {
        const report = await reportService_1.reportService.update(req.membership.businessId, (0, params_1.param)(req.params.id), req.body);
        res.json(report);
    },
    async addPhoto(req, res) {
        const file = req.file;
        const photo = await reportService_1.reportService.addPhoto(req.membership.businessId, (0, params_1.param)(req.params.id), file.buffer, file.mimetype);
        res.status(201).json(photo);
    },
    async deletePhoto(req, res) {
        await reportService_1.reportService.deletePhoto(req.membership.businessId, (0, params_1.param)(req.params.id), (0, params_1.param)(req.params.photoId));
        res.status(204).send();
    },
};
