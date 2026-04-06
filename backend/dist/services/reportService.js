"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportService = void 0;
const assetRepository_1 = require("../repositories/assetRepository");
const reportRepository_1 = require("../repositories/reportRepository");
const storageService_1 = require("./storageService");
const errors_1 = require("../utils/errors");
/**
 * Flatten Prisma report relations into the shape the frontend expects:
 * { reportedByName, assetName } instead of { reporter: { fullName }, asset: { name } }
 */
function formatReport(report) {
    const { reporter, asset, ...rest } = report;
    return {
        ...rest,
        reportedByName: reporter.fullName,
        assetName: asset.name,
    };
}
exports.reportService = {
    async getAll(businessId, filters) {
        const reports = await reportRepository_1.reportRepository.findAll(businessId, filters);
        return reports.map((report) => formatReport(report));
    },
    async getById(businessId, reportId) {
        const report = await reportRepository_1.reportRepository.findById(businessId, reportId);
        if (!report)
            throw new errors_1.NotFoundError("Report not found");
        return formatReport(report);
    },
    async create(businessId, data, userId) {
        // Verify asset belongs to business
        const asset = await assetRepository_1.assetRepository.findById(businessId, data.assetId);
        if (!asset)
            throw new errors_1.NotFoundError("Asset not found");
        const report = await reportRepository_1.reportRepository.create({
            ...data,
            businessId,
            reportedBy: userId,
        });
        // If severity is high or critical → update asset status to maintenance
        if (data.severity === "high" || data.severity === "critical") {
            await assetRepository_1.assetRepository.updateStatus(data.assetId, "maintenance");
        }
        return formatReport(report);
    },
    async update(businessId, reportId, data) {
        const existing = await reportRepository_1.reportRepository.findById(businessId, reportId);
        if (!existing)
            throw new errors_1.NotFoundError("Report not found");
        const updated = await reportRepository_1.reportRepository.update(businessId, reportId, data);
        // If status changed to resolved → check if asset can return to available
        if (data.status === "resolved" && existing.status !== "resolved") {
            const stillHasIssues = await reportRepository_1.reportRepository.hasOpenHighSeverityReports(existing.assetId);
            if (!stillHasIssues) {
                const asset = await assetRepository_1.assetRepository.findById(businessId, existing.assetId);
                if (asset && asset.status === "maintenance") {
                    await assetRepository_1.assetRepository.updateStatus(existing.assetId, "available");
                }
            }
        }
        return formatReport(updated);
    },
    async addPhoto(businessId, reportId, file, mimeType) {
        const report = await this.getById(businessId, reportId);
        const ext = mimeType.split("/")[1] || "jpg";
        const filePath = storageService_1.storageService.buildPath(businessId, reportId, "report", ext);
        const publicUrl = await storageService_1.storageService.upload("reports", filePath, file, mimeType);
        return reportRepository_1.reportRepository.addPhoto(report.id, { photoUrl: publicUrl });
    },
    async deletePhoto(businessId, reportId, photoId) {
        await this.getById(businessId, reportId);
        const photo = await reportRepository_1.reportRepository.findPhoto(photoId);
        if (!photo || photo.reportId !== reportId) {
            throw new errors_1.NotFoundError("Photo not found");
        }
        const path = storageService_1.storageService.extractPath(photo.photoUrl, "reports");
        await storageService_1.storageService.delete("reports", path).catch(() => { });
        return reportRepository_1.reportRepository.deletePhoto(reportId, photoId);
    },
};
