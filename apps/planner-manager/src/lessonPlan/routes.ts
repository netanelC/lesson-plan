import { FastifyInstance } from "fastify";
import { createLessonPlanSchema } from "@repo/types";
import { authenticate } from "../middleware/auth";
import { lessonPlanController } from "./controller";

export function lessonPlanRoutes(fastify: FastifyInstance): void {
  fastify.addHook("onRequest", authenticate);

  // Lesson Plan Routes
  fastify.post(
    "/",
    { schema: { body: createLessonPlanSchema } },
    lessonPlanController.create,
  );
  fastify.get("/", lessonPlanController.getAll);
  fastify.get("/:id", lessonPlanController.getOne);
  fastify.put("/:id", lessonPlanController.update);
  fastify.delete("/:id", lessonPlanController.delete);

  // Attachment Routes
  fastify.get(
    "/attachments/:id/download",
    lessonPlanController.downloadAttachment,
  );
  fastify.post("/:id/attachments", lessonPlanController.uploadAttachment);
  fastify.delete("/attachments/:fileId", lessonPlanController.removeAttachment);
}
