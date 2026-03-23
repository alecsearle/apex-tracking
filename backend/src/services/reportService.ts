import { assetRepository } from "../repositories/assetRepository";
import { reportRepository } from "../repositories/reportRepository";
import { storageService } from "./storageService";
import { NotFoundError } from "../utils/errors";

/**
 * Flatten Prisma report relations into the shape the frontend expects:
 * { reportedByName, assetName } instead of { reporter: { fullName }, asset: { name } }
 */
function formatReport(
  report: {
    id: string;
    assetId: string;
    sessionId: string | null;
    businessId: string;
    reportedBy: string;
    title: string;
    description: string;
    severity: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    reporter: { id: string; fullName: string };
    asset: { id: string; name: string };
    photos: Array<{ id: string; reportId: string; photoUrl: string; caption: string | null; createdAt: Date }>;
  }
) {
  const { reporter, asset, ...rest } = report;
  return {
    ...rest,
    reportedByName: reporter.fullName,
    assetName: asset.name,
  };
}

export const reportService = {
  async getAll(
    businessId: string,
    filters?: { assetId?: string; severity?: string; status?: string }
  ) {
    const reports = await reportRepository.findAll(businessId, filters);
    return reports.map((report) => formatReport(report));
  },

  async getById(businessId: string, reportId: string) {
    const report = await reportRepository.findById(businessId, reportId);
    if (!report) throw new NotFoundError("Report not found");
    return formatReport(report);
  },

  async create(
    businessId: string,
    data: {
      assetId: string;
      sessionId?: string;
      title: string;
      description: string;
      severity: "low" | "medium" | "high" | "critical";
    },
    userId: string
  ) {
    // Verify asset belongs to business
    const asset = await assetRepository.findById(businessId, data.assetId);
    if (!asset) throw new NotFoundError("Asset not found");

    const report = await reportRepository.create({
      ...data,
      businessId,
      reportedBy: userId,
    });

    // If severity is high or critical → update asset status to maintenance
    if (data.severity === "high" || data.severity === "critical") {
      await assetRepository.updateStatus(data.assetId, "maintenance");
    }

    return formatReport(report);
  },

  async update(
    businessId: string,
    reportId: string,
    data: {
      title?: string;
      description?: string;
      severity?: "low" | "medium" | "high" | "critical";
      status?: "open" | "in_progress" | "resolved";
    }
  ) {
    const existing = await reportRepository.findById(businessId, reportId);
    if (!existing) throw new NotFoundError("Report not found");

    const updated = await reportRepository.update(businessId, reportId, data);

    // If status changed to resolved → check if asset can return to available
    if (data.status === "resolved" && existing.status !== "resolved") {
      const stillHasIssues = await reportRepository.hasOpenHighSeverityReports(
        existing.assetId
      );
      if (!stillHasIssues) {
        const asset = await assetRepository.findById(businessId, existing.assetId);
        if (asset && asset.status === "maintenance") {
          await assetRepository.updateStatus(existing.assetId, "available");
        }
      }
    }

    return formatReport(updated);
  },

  async addPhoto(
    businessId: string,
    reportId: string,
    file: Buffer,
    mimeType: string
  ) {
    const report = await this.getById(businessId, reportId);

    const ext = mimeType.split("/")[1] || "jpg";
    const filePath = storageService.buildPath(businessId, reportId, "report", ext);
    const publicUrl = await storageService.upload("reports", filePath, file, mimeType);

    return reportRepository.addPhoto(report.id, { photoUrl: publicUrl });
  },

  async deletePhoto(businessId: string, reportId: string, photoId: string) {
    await this.getById(businessId, reportId);

    const photo = await reportRepository.findPhoto(photoId);
    if (!photo || photo.reportId !== reportId) {
      throw new NotFoundError("Photo not found");
    }

    const path = storageService.extractPath(photo.photoUrl, "reports");
    await storageService.delete("reports", path).catch(() => {});

    return reportRepository.deletePhoto(reportId, photoId);
  },
};
