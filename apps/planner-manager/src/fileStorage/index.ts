/* eslint-disable @typescript-eslint/naming-convention */
import {
  S3Client,
  PutObjectCommand,
  S3ClientConfig,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "config";

interface UploadFileResult {
  key: string;
  url: string;
  filename: string;
}

// 1. Initialize S3 Client (Deep clone to prevent config mutations error)
const s3Config = JSON.parse(
  JSON.stringify(config.get<S3ClientConfig>("minio")),
) as S3ClientConfig;

const s3Client = new S3Client({
  ...s3Config,
  customUserAgent: "PlannerApp/1.0",
});

const BUCKET_NAME = "lesson-attachments";

export const fileStorageService = {
  /**
   * Uploads a file to a specific "folder" (Lesson Plan ID)
   */
  async uploadFile(
    lessonPlanId: string,
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<UploadFileResult> {
    // 2. Sanitize the filename to be URL-safe
    // "My Cool Song!.mp3" -> "my-cool-song.mp3"
    const safeName = originalName
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\u0590-\u05FFa-z0-9.-]/g, ""); // Remove weird chars

    // 3. Create the "Folder" path
    // S3 doesn't have real folders, just keys with slashes.
    const key = `${lessonPlanId}/${safeName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key, // e.g., "123-abc-456/my-song.mp3"
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await s3Client.send(command);

    const endpointStr = s3Config.endpoint as string;

    return {
      key,
      // The URL will look like: http://localhost:9000/lesson-attachments/123-abc/song.mp3
      url: `${endpointStr}/${BUCKET_NAME}/${key}`,
      filename: safeName,
    };
  },

  /**
   * Deletes a file from MinIO based on its stored key.
   */
  async deleteFile(key: string): Promise<DeleteObjectCommandOutput> {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return s3Client.send(command);
  },

  /**
   * Generates a signed URL to download a file from MinIO.
   */
  async getDownloadUrl(key: string, filename?: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ResponseContentDisposition:
        filename != null
          ? `attachment; filename="${encodeURIComponent(filename)}"`
          : undefined,
    });
    // Link valid for 1 hour
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
  },
};
