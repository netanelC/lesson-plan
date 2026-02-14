import { LessonFilters } from "@repo/types";
import { fileStorageService } from "../file-storage";
import { lessonPlanDal } from "./DAL";

/**
 * Orchestrates complex business logic for lesson plans.
 * Coordinates operations that span multiple systems (e.g., MinIO + Database).
 */
export const lessonPlanService = {
  async getLessonPlans(filters: LessonFilters) {
    return lessonPlanDal.getAll(filters);
  },

  /**
   * Removes an attachment from both MinIO storage and the database.
   * Ensures data consistency across systems.
   */
  async removeAttachment(fileId: string): Promise<void> {
    // 1. Get the attachment metadata from the database
    const attachment = await lessonPlanDal.getAttachmentById(fileId);
    if (!attachment) {
      throw new Error("Attachment not found");
    }

    // 2. Extract the MinIO key from the URL
    // Example URL: http://localhost:9000/lesson-attachments/PLAN_ID/filename.pdf
    const key = attachment.url.split("lesson-attachments/")[1];

    // 3. Delete from MinIO if key exists
    if (key) {
      await fileStorageService.deleteFile(key);
    }

    // 4. Delete the database record
    await lessonPlanDal.deleteAttachment(fileId);
  },
};
