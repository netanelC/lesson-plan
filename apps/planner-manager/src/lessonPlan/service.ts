import axios from "axios";
import { LessonFilters, CreateLessonPlanDto, LessonPlan } from "@repo/types";
import config from "config";
import { fileStorageService } from "../file-storage";
import { lessonPlanDal } from "./DAL";

export const lessonPlanService = {
  async create(data: CreateLessonPlanDto, userId: string): Promise<LessonPlan> {
    return lessonPlanDal.create(data, userId);
  },

  async getLessonPlans(filters: LessonFilters) {
    // Handle default pagination logic here, not in the controller
    const sanitizedFilters: LessonFilters = {
      ...filters,
      page: filters.page !== undefined? Number(filters.page) : 1,
      limit: filters.limit !== undefined ? Number(filters.limit) : config.get<number>("page.limit"),
    };
    return lessonPlanDal.getAll(sanitizedFilters);
  },

  async getById(id: string) {
    return lessonPlanDal.getById(id);
  },

  async update(id: string, data: CreateLessonPlanDto) {
    const existing = await lessonPlanDal.getById(id);
    if (!existing) throw new Error("Lesson plan not found");
    return lessonPlanDal.update(id, data);
  },

  async delete(id: string) {
    return lessonPlanDal.delete(id);
  },

  async uploadAttachment(lessonPlanId: string, fileBuffer: Buffer, filename: string, mimetype: string) {
    // 1. Upload to MinIO
    const uploadResult = await fileStorageService.uploadFile(
      lessonPlanId,
      fileBuffer,
      filename,
      mimetype,
    );

    // 2. Save metadata to DB via DAL
    return lessonPlanDal.addAttachment(lessonPlanId, {
      filename: uploadResult.filename,
      url: uploadResult.url,
      fileType: mimetype,
      sizeBytes: fileBuffer.length,
    });
  },

  async getDownloadStream(attachmentId: string) {
    const attachment = await lessonPlanDal.getAttachmentById(attachmentId);
    if (!attachment) throw new Error("Attachment not found");

    const response = await axios.get(attachment.url, { responseType: "stream" });
    
    return {
      stream: response.data,
      filename: attachment.filename,
      fileType: attachment.fileType
    };
  },

  async removeAttachment(fileId: string): Promise<void> {
    const attachment = await lessonPlanDal.getAttachmentById(fileId);
    if (!attachment) throw new Error("Attachment not found");

    const key = attachment.url.split("lesson-attachments/")[1];
    if (key) {
      await fileStorageService.deleteFile(key);
    }

    await lessonPlanDal.deleteAttachment(fileId);
  },
};