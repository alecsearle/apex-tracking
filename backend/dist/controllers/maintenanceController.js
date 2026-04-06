"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceController = void 0;
const maintenanceService_1 = require("../services/maintenanceService");
const params_1 = require("../utils/params");
exports.maintenanceController = {
    async getSchedules(req, res) {
        const assetId = ((0, params_1.param)(req.params.assetId) || req.query.assetId);
        const schedules = await maintenanceService_1.maintenanceService.getSchedules(req.membership.businessId, assetId);
        res.json(schedules);
    },
    async getScheduleById(req, res) {
        const schedule = await maintenanceService_1.maintenanceService.getScheduleById(req.membership.businessId, (0, params_1.param)(req.params.id));
        res.json(schedule);
    },
    async createSchedule(req, res) {
        const schedule = await maintenanceService_1.maintenanceService.createSchedule(req.membership.businessId, req.body, req.user.id);
        res.status(201).json(schedule);
    },
    async updateSchedule(req, res) {
        const schedule = await maintenanceService_1.maintenanceService.updateSchedule(req.membership.businessId, (0, params_1.param)(req.params.id), req.body, req.user.id, req.membership.role);
        res.json(schedule);
    },
    async deleteSchedule(req, res) {
        await maintenanceService_1.maintenanceService.deleteSchedule(req.membership.businessId, (0, params_1.param)(req.params.id), req.user.id, req.membership.role);
        res.status(204).send();
    },
    async completeSchedule(req, res) {
        const log = await maintenanceService_1.maintenanceService.completeSchedule(req.membership.businessId, (0, params_1.param)(req.params.id), req.user.id, req.body);
        res.status(201).json(log);
    },
    async getLogs(req, res) {
        const logs = await maintenanceService_1.maintenanceService.getLogs(req.membership.businessId, (0, params_1.param)(req.params.id));
        res.json(logs);
    },
    async getDueSchedules(req, res) {
        const due = await maintenanceService_1.maintenanceService.getDueSchedules(req.membership.businessId);
        res.json(due);
    },
    async addLogPhoto(req, res) {
        const file = req.file;
        const photo = await maintenanceService_1.maintenanceService.addLogPhoto(req.membership.businessId, (0, params_1.param)(req.params.logId), file.buffer, file.mimetype);
        res.status(201).json(photo);
    },
    async deleteLogPhoto(req, res) {
        await maintenanceService_1.maintenanceService.deleteLogPhoto(req.membership.businessId, (0, params_1.param)(req.params.logId), (0, params_1.param)(req.params.photoId));
        res.status(204).send();
    },
};
