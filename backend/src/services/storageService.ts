import { supabaseAdmin } from "../config/supabase";
import { env } from "../config/env";
import { AppError } from "../utils/errors";

type BucketName = "assets" | "reports" | "maintenance";

const bucketMap: Record<BucketName, string> = {
  assets: env.SUPABASE_STORAGE_BUCKET_ASSETS,
  reports: env.SUPABASE_STORAGE_BUCKET_REPORTS,
  maintenance: env.SUPABASE_STORAGE_BUCKET_MAINTENANCE,
};

/**
 * Shared Supabase Storage upload/delete service.
 * File path format: {businessId}/{assetId}/{type}-{timestamp}.{ext}
 */
export const storageService = {
  async upload(
    bucket: BucketName,
    filePath: string,
    file: Buffer,
    mimeType: string
  ): Promise<string> {
    const bucketName = bucketMap[bucket];

    const { error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, file, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      throw new AppError(`Storage upload failed: ${error.message}`, 500, "STORAGE_ERROR");
    }

    const { data } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async delete(bucket: BucketName, filePath: string): Promise<void> {
    const bucketName = bucketMap[bucket];

    const { error } = await supabaseAdmin.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      throw new AppError(`Storage delete failed: ${error.message}`, 500, "STORAGE_ERROR");
    }
  },

  /**
   * Extract the storage path from a full public URL.
   */
  extractPath(publicUrl: string, bucket: BucketName): string {
    const bucketName = bucketMap[bucket];
    const marker = `/storage/v1/object/public/${bucketName}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return publicUrl;
    return publicUrl.slice(idx + marker.length);
  },

  /**
   * Generate a storage file path.
   */
  buildPath(
    businessId: string,
    entityId: string,
    type: string,
    ext: string
  ): string {
    return `${businessId}/${entityId}/${type}-${Date.now()}.${ext}`;
  },
};
