import { LessonFilters } from "@repo/types";
import { Prisma, LessonPlan } from "../db/prisma/generated/client";
import { prisma } from "../db/prisma/prisma"; 

/**
 * Creates a new Lesson Plan in the database.
 * @param data Prisma-validated input object
 * @returns The created LessonPlan record
 */
export async function createLessonPlan(
  data: Prisma.LessonPlanCreateInput
): Promise<LessonPlan> {
  return prisma.lessonPlan.create({
    data,
  });
}

export async function getAll(filters: LessonFilters, skip: number, limit: number): Promise<[number, LessonPlan[]]> {
  const whereClause: Prisma.LessonPlanWhereInput = {};

  if (filters.ageGroup) whereClause.ageGroup = filters.ageGroup;
  if (filters.frame) whereClause.frame = filters.frame;

  if (filters.search !== undefined) {
    whereClause.OR = [
      { topic: { contains: filters.search, mode: "insensitive" } },
      { unit: { contains: filters.search, mode: "insensitive" } },
      { superGoal: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  // Run the count and the fetch in parallel for better performance
  const plans = await Promise.all([
    prisma.lessonPlan.count({ where: whereClause }),
    prisma.lessonPlan.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            role: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return plans;
}
