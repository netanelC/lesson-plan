/* eslint-disable @typescript-eslint/naming-convention */
import { FastifyRequest, FastifyReply } from "fastify";
import { status } from "http-status";
import { CreateLessonPlanBody, LessonFilters } from "@repo/types";
import { Prisma } from "../db/prisma/generated/client";
import { BadRequestError } from "../utils/errors";
import * as lessonPlanService from "./service";

export async function createLessonPlanController(
  request: FastifyRequest<{ Body: CreateLessonPlanBody }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const newLessonPlan = await lessonPlanService.createLessonPlan(
    request.body,
    request.user.id,
  );

  return reply.status(status.CREATED).send({
    success: true,
    data: newLessonPlan,
  });
}

export async function getLessonPlansController(
  request: FastifyRequest<{ Querystring: LessonFilters }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const result = await lessonPlanService.getLessonPlans(request.query);
  return reply.status(status.OK).send(result);
}

export async function getLessonPlanByIdController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const lessonPlan = await lessonPlanService.getLessonPlanById(
    request.params.id,
  );
  return reply.status(status.OK).send({
    success: true,
    data: lessonPlan,
  });
}

export async function updateLessonPlanController(
  req: FastifyRequest<{
    Params: { id: string };
    Body: Prisma.LessonPlanUncheckedUpdateInput;
  }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const updatedPlan = await lessonPlanService.updateLessonPlan(
    req.params.id,
    req.body,
  );
  return reply.status(status.OK).send({
    success: true,
    data: updatedPlan,
  });
}

export async function deleteLessonPlanController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  await lessonPlanService.deleteLessonPlan(req.params.id);
  return reply.status(status.NO_CONTENT).send();
}

export async function uploadAttachmentController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const data = await req.file();
  if (!data) {
    throw new BadRequestError("No file uploaded");
  }

  const attachment = await lessonPlanService.uploadAttachment(
    req.params.id,
    data,
  );
  return reply.status(status.CREATED).send({
    success: true,
    data: attachment,
  });
}

export async function downloadAttachmentController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<FastifyReply | void> {
  const signedUrl = await lessonPlanService.getAttachmentDownloadUrl(
    req.params.id,
  );
  return reply.status(status.OK).send({ url: signedUrl });
}

export async function removeAttachmentController(
  req: FastifyRequest<{ Params: { fileId: string } }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  await lessonPlanService.removeAttachment(req.params.fileId);
  return reply.status(status.NO_CONTENT).send();
}

export async function toggleSaveLessonPlanController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const result = await lessonPlanService.toggleSaveLessonPlan(
    req.user.id,
    req.params.id,
  );
  return reply.status(status.OK).send({
    success: true,
    data: result,
  });
}

export async function getSavedLessonPlansController(
  req: FastifyRequest<{ Querystring: LessonFilters }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const result = await lessonPlanService.getSavedLessonPlans(
    req.user.id,
    req.query,
  );
  return reply.status(status.OK).send(result);
}
