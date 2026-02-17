import { FastifyRequest, FastifyReply } from "fastify";
import { status } from "http-status";
import { CreateLessonPlanDto, LessonFilters, ApiResponse } from "@repo/types";
import { lessonPlanService } from "./service";

export const lessonPlanController = {
  create: async (
    // eslint-disable-next-line @typescript-eslint/naming-convention
    req: FastifyRequest<{ Body: CreateLessonPlanDto }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> => {
    try {
      const newPlan = await lessonPlanService.create(req.body, req.user.id);
      return await reply.code(status.CREATED).send({ success: true, data: newPlan } as ApiResponse<typeof newPlan>);
    } catch (error) {
      req.log.error(error);
      return reply.code(status.INTERNAL_SERVER_ERROR).send({ success: false, error: "Creation Failed", statusCode: status.INTERNAL_SERVER_ERROR });
    }
  },

  getAll: async (
    // eslint-disable-next-line @typescript-eslint/naming-convention
    req: FastifyRequest<{ Querystring: LessonFilters }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> => {
    try {
      const result = await lessonPlanService.getLessonPlans(req.query as Partial<LessonFilters>);
      return await reply.code(status.OK).send({ success: true, data: result } as ApiResponse<typeof result>);
    } catch (error) {
      req.log.error(error);
      return reply.code(status.INTERNAL_SERVER_ERROR).send({ success: false, error: "Fetch Failed", statusCode: status.INTERNAL_SERVER_ERROR });
    }
  },

  getOne: async (
    // eslint-disable-next-line @typescript-eslint/naming-convention
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> => {
    try {
      const plan = await lessonPlanService.getById(req.params.id);
      if (!plan) {
        return await reply.code(status.NOT_FOUND).send({ success: false, error: "Not Found", message: "Lesson plan not found", statusCode: status.NOT_FOUND });
      }
      return await reply.code(status.OK).send({ success: true, data: plan } as ApiResponse<typeof plan>);
    } catch (error) {
      req.log.error(error);
      return reply.code(status.INTERNAL_SERVER_ERROR).send({ success: false, error: "Fetch Failed", statusCode: status.INTERNAL_SERVER_ERROR });
    }
  },

  update: async (
    // eslint-disable-next-line @typescript-eslint/naming-convention
    req: FastifyRequest<{ Params: { id: string }; Body: CreateLessonPlanDto }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> => {
    try {
      const updatedPlan = await lessonPlanService.update(req.params.id, req.body);
      return await reply.code(status.OK).send({ success: true, data: updatedPlan } as ApiResponse<typeof updatedPlan>);
    } catch (error) {
      req.log.error(error);
      if (error instanceof Error) {
        const statusCode = error.message === "Lesson plan not found" ? status.NOT_FOUND : status.INTERNAL_SERVER_ERROR;
        return reply.code(statusCode).send({ success: false, error: "Update Failed", message: error.message, statusCode });
      }
      return reply.code(status.INTERNAL_SERVER_ERROR).send({ success: false, error: "Update Failed", message: `Unknown error: ${String(error)}`, statusCode: status.INTERNAL_SERVER_ERROR });
    }
  },

  delete: async (
    // eslint-disable-next-line @typescript-eslint/naming-convention
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> => {
    try {
      await lessonPlanService.delete(req.params.id);
      return await reply.code(status.NO_CONTENT).send();
    } catch (error) {
      req.log.error(error);
      return reply.code(status.INTERNAL_SERVER_ERROR).send({ success: false, error: "Delete Failed", statusCode: status.INTERNAL_SERVER_ERROR });
    }
  },

  uploadAttachment: async (
    // eslint-disable-next-line @typescript-eslint/naming-convention
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> => {
    try {
      const data = await req.file();
      if (!data) {
        return await reply.code(status.BAD_REQUEST).send({ success: false, error: "Bad Request", message: "No file uploaded", statusCode: status.BAD_REQUEST });
      }

      const fileBuffer = await data.toBuffer();
      const attachment = await lessonPlanService.uploadAttachment(
        req.params.id,
        fileBuffer,
        data.filename,
        data.mimetype
      );

      return await reply.code(status.CREATED).send({ success: true, data: attachment } as ApiResponse<typeof attachment>);
    } catch (error) {
      req.log.error(error);
      return reply.code(status.INTERNAL_SERVER_ERROR).send({ success: false, error: "Upload Failed", statusCode: status.INTERNAL_SERVER_ERROR });
    }
  },

  downloadAttachment: async (
    // eslint-disable-next-line @typescript-eslint/naming-convention
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> => {
    try {
      const { stream, filename, fileType } = await lessonPlanService.getDownloadStream(req.params.id);

      reply.header("Content-Type", fileType);
      reply.header("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
      
      return await reply.send(stream);
    } catch (error) {
      req.log.error(error);
      const statusCode = error.message === "Attachment not found" ? status.NOT_FOUND : status.INTERNAL_SERVER_ERROR;
      return reply.code(statusCode).send({ success: false, error: "Download Failed", message: error.message, statusCode });
    }
  },

  removeAttachment: async (
    // eslint-disable-next-line @typescript-eslint/naming-convention
    req: FastifyRequest<{ Params: { fileId: string } }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> => {
    try {
      await lessonPlanService.removeAttachment(req.params.fileId);
      return await reply.code(status.NO_CONTENT).send();
    } catch (error) {
      req.log.error(error);
      if (error instanceof Error) {
        const statusCode = error.message === "Attachment not found" ? status.NOT_FOUND : status.INTERNAL_SERVER_ERROR;
        return reply.code(statusCode).send({ success: false, error: "Delete Failed", message: error.message, statusCode });
      }
      return reply.code(status.INTERNAL_SERVER_ERROR).send({ success: false, error: "Delete Failed", message: `Unknown error: ${String(error)}`, statusCode: status.INTERNAL_SERVER_ERROR });
    }
  },
};