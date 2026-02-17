import {
  S3Client,
  PutObjectCommand,
  S3ClientConfig,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import config from "config";

const s3Config = config.get<S3ClientConfig>("minio");
const s3Client = new S3Client({
  ...s3Config,
  customUserAgent: "PlannerApp/1.0",
});

const BUCKET_NAME = "lesson-attachments";

export const fileStorageService = {
  /**
   * Uploads a file to a specific "folder" (Lesson Plan ID)
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async uploadFile(
    lessonPlanId: string,
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
  ) {

    const safeName = originalName
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\u0590-\u05FFa-z0-9.-]/g, ""); // Remove weird chars

    const key = `${lessonPlanId}/${safeName}`;

    const command = new PutObjectCommand({
      /* eslint-disable @typescript-eslint/naming-convention */
      Bucket: BUCKET_NAME,
      Key: key, // e.g., "123-abc-456/my-song.mp3"
      Body: fileBuffer,
      ContentType: mimeType,
      /* eslint-enable @typescript-eslint/naming-convention */
    });

    await s3Client.send(command);

    return {
      key: key,
      // The URL will look like: http://localhost:9000/lesson-attachments/123-abc/song.mp3
      url: `${s3Config.endpoint as string}/${BUCKET_NAME}/${key}`,
      filename: safeName,
    };
  },

  /**
   * Deletes a file from MinIO based on its stored key.
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      /* eslint-disable @typescript-eslint/naming-convention */
      Bucket: BUCKET_NAME,
      Key: key,
      /* eslint-enable @typescript-eslint/naming-convention */
    });

    await s3Client.send(command);
  },
};
