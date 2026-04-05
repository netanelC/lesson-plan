import { FastifyInstance } from "fastify";
import { CreateLessonPlanSchema, LessonFiltersSchema } from "@repo/types";
import { createLessonPlanController, getLessonPlansController } from "./controller";

export function lessonPlanRoutes(fastify: FastifyInstance): void {
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
}
