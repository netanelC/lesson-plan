import { MultipartFile } from "@fastify/multipart";
import { CreateLessonPlanBody, LessonFilters } from "@repo/types";
import { Prisma, LessonPlan, Attachment } from "../db/prisma/generated/client";
import { fileStorageService } from "../fileStorage";
import { NotFoundError, InternalServerError } from "../utils/errors";
import * as dal from "./DAL";

const DEFAULT_PAGE = 1;
const EXPECTED_URL_PARTS = 2;

export async function createLessonPlan(
  data: CreateLessonPlanBody,
  authorId: string,
): Promise<LessonPlan> {
  return dal.createLessonPlan({
    ...data,
    authorId,
  });
}

export async function getLessonPlans(filters: LessonFilters): Promise<{
  data: (LessonPlan & { author: { fullName: string } })[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  const page = filters.page;
  const limit = filters.limit;
  const skip = (page - DEFAULT_PAGE) * limit;

  const [total, rawLessonPlans] = await dal.getAll(filters, skip, limit);

  return {
    data: rawLessonPlans as unknown as (LessonPlan & {
      author: { fullName: string };
    })[],
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getLessonPlanById(id: string): Promise<LessonPlan> {
  const plan = await dal.getById(id);
  if (!plan) {
    throw new NotFoundError("Lesson plan not found");
  }
  return plan;
}

export async function updateLessonPlan(
  id: string,
  data: Prisma.LessonPlanUncheckedUpdateInput,
): Promise<LessonPlan> {
  const existing = await dal.getById(id);
  if (!existing) {
    throw new NotFoundError("המערך לא נמצא");
  }

  return dal.updateLessonPlan(id, data);
}

export async function deleteLessonPlan(id: string): Promise<void> {
  const existing = await dal.getById(id);
  if (!existing) {
    throw new NotFoundError("המערך לא נמצא");
  }
  await dal.deleteLessonPlan(id);
}

export async function uploadAttachment(
  lessonPlanId: string,
  file: MultipartFile,
): Promise<Attachment> {
  const fileBuffer = await file.toBuffer();

  const uploadResult = await fileStorageService.uploadFile(
    lessonPlanId,
    fileBuffer,
    file.filename,
    file.mimetype,
  );

  return dal.addAttachment(lessonPlanId, {
    filename: uploadResult.filename,
    url: uploadResult.url,
    fileType: file.mimetype,
    sizeBytes: fileBuffer.length,
  });
}

export async function getAttachmentDownloadUrl(
  fileId: string,
): Promise<string> {
  const attachment = await dal.getAttachmentById(fileId);
  if (!attachment) {
    throw new NotFoundError("Attachment not found");
  }

  const urlParts = attachment.url.split("/lesson-attachments/");
  if (
    urlParts.length !== EXPECTED_URL_PARTS ||
    urlParts[1] === undefined ||
    urlParts[1] === ""
  ) {
    throw new InternalServerError("Invalid file URL format");
  }

  const key = urlParts[1];
  return fileStorageService.getDownloadUrl(key, attachment.filename);
}

export async function removeAttachment(fileId: string): Promise<void> {
  const attachment = await dal.getAttachmentById(fileId);
  if (!attachment) {
    throw new NotFoundError("Attachment not found");
  }

  const urlParts = attachment.url.split("/lesson-attachments/");
  if (
    urlParts.length === EXPECTED_URL_PARTS &&
    urlParts[1] !== undefined &&
    urlParts[1] !== ""
  ) {
    await fileStorageService.deleteFile(urlParts[1]);
  }

  await dal.deleteAttachment(fileId);
}
