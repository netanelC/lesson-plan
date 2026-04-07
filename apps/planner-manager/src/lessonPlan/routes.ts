import { FastifyInstance } from "fastify";
import { CreateLessonPlanSchema, LessonFiltersSchema } from "@repo/types";
import { authenticate } from "../middleware/auth";
import { createLessonPlanController, getLessonPlanByIdController, getLessonPlansController } from "./controller";

export function lessonPlanRoutes(fastify: FastifyInstance): void {
  fastify.addHook("onRequest", authenticate);
  fastify.post(
    "/",
    {
      schema: {
        body: CreateLessonPlanSchema,
      },
    },
    createLessonPlanController
  );

  fastify.get(
      "/",
      { schema: { querystring: LessonFiltersSchema } },
      getLessonPlansController
    );

  fastify.get("/:id", getLessonPlanByIdController);
  // fastify.put("/:id", lessonPlanController.update);
  // fastify.delete("/:id", lessonPlanController.delete);

  // // Attachment Routes
  // fastify.get(
  //   "/attachments/:id/download",
  //   lessonPlanController.downloadAttachment,
  // );
  // fastify.post("/:id/attachments", lessonPlanController.uploadAttachment);
  // fastify.delete("/attachments/:fileId", lessonPlanController.removeAttachment);
}
