import { FastifyInstance } from "fastify";
import { LessonPlanCreateInputSchema } from "@repo/types";
import { createLessonPlanController } from "./controller";

export function lessonPlanRoutes(fastify: FastifyInstance): void {
  fastify.post(
    "/",
    {
      schema: {
        body: LessonPlanCreateInputSchema,
      },
    },
    createLessonPlanController
  );
}
