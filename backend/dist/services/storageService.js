"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageService = void 0;
const supabase_1 = require("../config/supabase");
const env_1 = require("../config/env");
const errors_1 = require("../utils/errors");
const bucketMap = {
    assets: env_1.env.SUPABASE_STORAGE_BUCKET_ASSETS,
    reports: env_1.env.SUPABASE_STORAGE_BUCKET_REPORTS,
    maintenance: env_1.env.SUPABASE_STORAGE_BUCKET_MAINTENANCE,
};
/**
 * Shared Supabase Storage upload/delete service.
 * File path format: {businessId}/{assetId}/{type}-{timestamp}.{ext}
 */
exports.storageService = {
    async upload(bucket, filePath, file, mimeType) {
        const bucketName = bucketMap[bucket];
        const { error } = await supabase_1.supabaseAdmin.storage
            .from(bucketName)
            .upload(filePath, file, {
            contentType: mimeType,
            upsert: true,
        });
        if (error) {
            throw new errors_1.AppError(`Storage upload failed: ${error.message}`, 500, "STORAGE_ERROR");
        }
        const { data } = supabase_1.supabaseAdmin.storage
            .from(bucketName)
            .getPublicUrl(filePath);
        return data.publicUrl;
    },
    async delete(bucket, filePath) {
        const bucketName = bucketMap[bucket];
        const { error } = await supabase_1.supabaseAdmin.storage
            .from(bucketName)
            .remove([filePath]);
        if (error) {
            throw new errors_1.AppError(`Storage delete failed: ${error.message}`, 500, "STORAGE_ERROR");
        }
    },
    /**
     * Extract the storage path from a full public URL.
     */
    extractPath(publicUrl, bucket) {
        const bucketName = bucketMap[bucket];
        const marker = `/storage/v1/object/public/${bucketName}/`;
        const idx = publicUrl.indexOf(marker);
        if (idx === -1)
            return publicUrl;
        return publicUrl.slice(idx + marker.length);
    },
    /**
     * Generate a storage file path.
     */
    buildPath(businessId, entityId, type, ext) {
        return `${businessId}/${entityId}/${type}-${Date.now()}.${ext}`;
    },
};
