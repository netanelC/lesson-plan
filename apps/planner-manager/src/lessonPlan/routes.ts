import { FastifyInstance } from "fastify";
import { CreateLessonPlanSchema } from "@repo/types";
import { createLessonPlanController } from "./controller";

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
}
