/* eslint-disable @typescript-eslint/naming-convention */
import { FastifyRequest, FastifyReply } from "fastify";
import { status } from "http-status";
import { CreateLessonPlanBody, LessonFilters } from "@repo/types";
import { Prisma } from "../db/prisma/generated/client";
import { fileStorageService } from "../fileStorage";
import {
  createLessonPlan,
  getAll,
  getById,
  updateLessonPlan,
  deleteLessonPlan,
  addAttachment,
  getAttachmentById,
  deleteAttachment,
} from "./DAL";

type CreateLessonPlanRequest = FastifyRequest<{
  Body: CreateLessonPlanBody;
}>;

export async function createLessonPlanController(
  request: CreateLessonPlanRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const newLessonPlan = await createLessonPlan({
      ...request.body,
      authorId: request.user.id,
    });

    return await reply.status(status.CREATED).send({
      success: true,
      data: newLessonPlan,
    });
  } catch (error: unknown) {
    request.log.error({ err: error }, "Failed to create lesson plan");

    return reply.status(status.INTERNAL_SERVER_ERROR).send({
      success: false,
      error: "Internal Server Error",
    });
  }
}

export async function getLessonPlansController(
  request: FastifyRequest<{ Querystring: LessonFilters }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const { page, limit } = request.query;
    const skip = (page - 1) * limit;

    const [total, rawLessonPlans] = await getAll(request.query, skip, limit);

    // TEMPORARY MOCK: Inject fake author details until we build the User relation
    const lessonPlans = rawLessonPlans.map((plan) => ({
      ...plan,
      author: { fullName: "נתנאל" },
    }));

    const totalPages = Math.ceil(total / limit);

    return await reply.status(status.OK).send({
      data: lessonPlans,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error: unknown) {
    request.log.error(error);
    return reply
      .status(status.INTERNAL_SERVER_ERROR)
      .send({ success: false, error: "Internal Server Error" });
  }
}

export async function getLessonPlanByIdController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const { id } = request.params;
    const lessonPlan = await getById(id);

    if (!lessonPlan) {
      return await reply.status(status.NOT_FOUND).send({
        success: false,
        error: "Lesson plan not found",
      });
    }

    return await reply.status(status.OK).send({
      success: true,
      data: lessonPlan,
    });
  } catch (error: unknown) {
    request.log.error({ err: error }, "Failed to fetch lesson plan by ID");

    return reply.status(status.INTERNAL_SERVER_ERROR).send({
      success: false,
      error: "Internal Server Error",
    });
  }
}

export async function updateLessonPlanController(
  req: FastifyRequest<{
    Params: { id: string };
    Body: Prisma.LessonPlanUncheckedUpdateInput;
  }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // 1. Check if it exists
    const existing = await getById(id);
    if (!existing) {
      return await reply
        .status(status.NOT_FOUND)
        .send({ message: "המערך לא נמצא" });
    }

    // 2. Perform update
    const updatedPlan = await updateLessonPlan(id, updateData);
    return await reply.status(status.OK).send(updatedPlan);
  } catch (error: unknown) {
    req.log.error(error);
    return reply
      .status(status.INTERNAL_SERVER_ERROR)
      .send({ message: "שגיאה בעדכון המערך" });
  }
}

export async function deleteLessonPlanController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { id } = req.params;
  try {
    await deleteLessonPlan(id);
    return await reply.status(status.NO_CONTENT).send();
  } catch (error: unknown) {
    req.log.error(error);
    return reply
      .status(status.INTERNAL_SERVER_ERROR)
      .send({ message: "שגיאה במחיקת המערך" });
  }
}

export async function uploadAttachmentController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  // 1. Get the file from the request stream
  const data = await req.file();
  if (!data) {
    return reply
      .status(status.BAD_REQUEST)
      .send({ message: "No file uploaded" });
  }

  const lessonPlanId = req.params.id;

  try {
    // 2. Upload to MinIO using our service
    const fileBuffer = await data.toBuffer();
    const uploadResult = await fileStorageService.uploadFile(
      lessonPlanId,
      fileBuffer,
      data.filename,
      data.mimetype,
    );

    // 3. Save the metadata to Postgres
    const attachment = await addAttachment(lessonPlanId, {
      filename: uploadResult.filename,
      url: uploadResult.url,
      fileType: data.mimetype,
      sizeBytes: fileBuffer.length,
    });

    return await reply.status(status.CREATED).send(attachment);
  } catch (error: unknown) {
    req.log.error(error);
    return reply
      .status(status.INTERNAL_SERVER_ERROR)
      .send({ message: "שגיאה בהעלאת הקובץ" });
  }
}

export async function downloadAttachmentController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<FastifyReply | void> {
  const { id } = req.params;

  // 1. Get attachment metadata from DB
  const attachment = await getAttachmentById(id);
  if (!attachment) {
    return reply
      .status(status.NOT_FOUND)
      .send({ message: "Attachment not found" });
  }

  try {
    // Try to extract key from MinIO
    const urlParts = attachment.url.split("/lesson-attachments/");
    const EXPECTED_PARTS_COUNT = 2;
    if (urlParts.length !== EXPECTED_PARTS_COUNT || urlParts[1] == null) {
      return await reply
        .status(status.INTERNAL_SERVER_ERROR)
        .send({ message: "Invalid file URL format" });
    }

    const key = urlParts[1];

    // Generate a pre-signed URL for direct download
    const signedUrl = await fileStorageService.getDownloadUrl(
      key,
      attachment.filename,
    );

    // Return the pre-signed URL instead of redirecting
    // The frontend will use Axios to securely fetch this URL using its JWT,
    // and then navigate the browser to download the file directly from MinIO.
    return await reply.status(status.OK).send({ url: signedUrl });
  } catch (error: unknown) {
    req.log.error(error);
    return reply
      .status(status.INTERNAL_SERVER_ERROR)
      .send({ message: "Failed to download file" });
  }
}

export async function removeAttachmentController(
  req: FastifyRequest<{ Params: { fileId: string } }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { fileId } = req.params;

  try {
    const attachment = await getAttachmentById(fileId);
    if (!attachment) {
      return await reply
        .status(status.NOT_FOUND)
        .send({ message: "Attachment not found" });
    }

    // Try to extract key and delete from MinIO (best effort orchestration without dedicated service for now)
    const urlParts = attachment.url.split("/lesson-attachments/");
    const expectedPartsLength = 2;
    if (
      urlParts.length === expectedPartsLength &&
      urlParts[1] !== undefined &&
      urlParts[1] !== ""
    ) {
      await fileStorageService.deleteFile(urlParts[1]);
    }

    // Delete from DB
    await deleteAttachment(fileId);
    return await reply.status(status.NO_CONTENT).send();
  } catch (error: unknown) {
    req.log.error(error);
    return reply
      .status(status.INTERNAL_SERVER_ERROR)
      .send({ message: "שגיאה במחיקת הקובץ" });
  }
}
