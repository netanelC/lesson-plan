import { S3Client, PutObjectCommand, S3ClientConfig, ObjectCannedACL } from '@aws-sdk/client-s3';
import config from 'config';

// 1. Initialize S3 Client (Same as before)
const s3Config = config.get<S3ClientConfig>('minio');
const s3Client = new S3Client({ ...s3Config, customUserAgent: "PlannerApp/1.0" });

const BUCKET_NAME = 'lesson-attachments';

export const fileStorageService = {
  
  /**
   * Uploads a file to a specific "folder" (Lesson Plan ID)
   */
  async uploadFile(
    lessonPlanId: string, 
    fileBuffer: Buffer, 
    originalName: string, 
    mimeType: string
  ) {
    // 2. Sanitize the filename to be URL-safe
    // "My Cool Song!.mp3" -> "my-cool-song.mp3"
    const safeName = originalName
      .toLowerCase()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^a-z0-9.-]/g, ''); // Remove weird chars

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

    return {
      key: key,
      // The URL will look like: http://localhost:9000/lesson-attachments/123-abc/song.mp3
      url: `${s3Config.endpoint}/${BUCKET_NAME}/${key}`,
      filename: safeName
    };
  }
};
