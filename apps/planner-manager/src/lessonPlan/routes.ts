import { FastifyInstance } from "fastify";
import { CreateLessonPlanSchema, LessonFiltersSchema } from "@repo/types";
import { authenticate } from "../middleware/auth";
import {
  createLessonPlanController,
  deleteLessonPlanController,
  downloadAttachmentController,
  getLessonPlanByIdController,
  getLessonPlansController,
  removeAttachmentController,
  updateLessonPlanController,
  uploadAttachmentController,
  toggleSaveLessonPlanController,
  getSavedLessonPlansController,
} from "./controller";

export function lessonPlanRoutes(fastify: FastifyInstance): void {
  fastify.addHook("onRequest", authenticate);
  fastify.post(
    "/",
    {
      schema: {
        body: CreateLessonPlanSchema,
      },
    },
    createLessonPlanController,
  );

  fastify.get(
    "/",
    { schema: { querystring: LessonFiltersSchema } },
    getLessonPlansController,
  );

  fastify.get("/:id", getLessonPlanByIdController);
  fastify.put("/:id", updateLessonPlanController);
  fastify.delete("/:id", deleteLessonPlanController);

  // Attachment Routes
  fastify.get("/attachments/:id/download", downloadAttachmentController);
  fastify.post("/:id/attachments", uploadAttachmentController);
  fastify.delete("/attachments/:fileId", removeAttachmentController);

  // Bookmark Routes
  fastify.post("/:id/save", toggleSaveLessonPlanController);
  fastify.get(
    "/saved",
    { schema: { querystring: LessonFiltersSchema } },
    getSavedLessonPlansController,
  );
}
