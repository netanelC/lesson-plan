import { Prisma, LessonPlan } from "../db/prisma/generated/client";
import { prisma } from "../db/prisma/prisma"; 

/**
 * Creates a new Lesson Plan in the database.
 * @param data Prisma-validated input object
 * @returns The created LessonPlan record
 */
export async function createLessonPlanInDB(
  data: Prisma.LessonPlanCreateInput
): Promise<LessonPlan> {
  return prisma.lessonPlan.create({
    data,
  });
}
