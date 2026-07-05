import { LessonFilters } from "@repo/types";
import { Prisma, LessonPlan, Attachment } from "../db/prisma/generated/client";
import { prisma } from "../db/prisma/prisma";

/**
 * Creates a new Lesson Plan in the database.
 * @param data Prisma-validated input object
 * @returns The created LessonPlan record
 */
export async function createLessonPlan(
  data: Prisma.LessonPlanUncheckedCreateInput,
): Promise<LessonPlan> {
  return prisma.lessonPlan.create({
    data,
  });
}

/**
 * Fetches a paginated list of lesson plans based on the provided filters.
 * @param filters An object containing filter criteria and pagination options
 * @param skip Number of records to skip (for pagination)
 * @param limit Number of records to return (for pagination)
 * @returns A tuple containing the total count of matching records and the array of fetched LessonPlan records
 */
export async function getAll(
  filters: LessonFilters,
  skip: number,
  limit: number,
): Promise<[number, LessonPlan[]]> {
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
        savedBy: {
          select: {
            userId: true,
          },
        },
      },
    }),
  ]);

  return plans;
}

/**
 * Fetches a single lesson plan and "Joins" all its attachments
 * @param id The ID of the lesson plan to fetch
 * @returns The fetched LessonPlan record or null if not found
 */
export async function getById(id: string): Promise<LessonPlan | null> {
  return prisma.lessonPlan.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          avatarUrl: true,
        },
      },
      attachments: true,
      savedBy: {
        select: {
          userId: true,
        },
      },
    },
  });
}

/**
 * Updates an existing lesson plan.
 * @param id The ID of the lesson plan to update
 * @param data The partial data to update the lesson plan with
 * @returns The updated LessonPlan record
 */
export async function updateLessonPlan(
  id: string,
  data: Prisma.LessonPlanUncheckedUpdateInput,
): Promise<LessonPlan> {
  return prisma.lessonPlan.update({
    where: { id },
    data: {
      ...data,
      ...(data.lessonFlow !== undefined && {
        lessonFlow: JSON.parse(
          JSON.stringify(data.lessonFlow),
        ) as Prisma.InputJsonValue,
      }),
    },
  });
}

/**
 * Deletes a specific lesson plan from the database.
 * @param id The ID of the lesson plan to delete
 * @returns The deleted LessonPlan record
 */
export async function deleteLessonPlan(id: string): Promise<LessonPlan> {
  return prisma.lessonPlan.delete({
    where: { id },
  });
}

/**
 * Creates and attaches a new file record to a lesson plan.
 * @param lessonPlanId The ID of the parent lesson plan
 * @param fileInfo An object containing the file's metadata and URL
 * @returns The created Attachment record
 */
export async function addAttachment(
  lessonPlanId: string,
  fileInfo: {
    filename: string;
    url: string;
    fileType: string;
    sizeBytes: number;
  },
): Promise<Attachment> {
  return prisma.attachment.create({
    data: {
      ...fileInfo,
      lessonPlanId,
    },
  });
}

/**
 * Fetches a specific attachment by its ID.
 * @param id The ID of the attachment
 * @returns The Attachment record or null if not found
 */
export async function getAttachmentById(
  id: string,
): Promise<Attachment | null> {
  return prisma.attachment.findUnique({
    where: { id },
  });
}

/**
 * Deletes a specific attachment from the database.
 * @param id The ID of the attachment to delete
 * @returns The deleted Attachment record
 */
export async function deleteAttachment(id: string): Promise<Attachment> {
  return prisma.attachment.delete({
    where: { id },
  });
}

export async function toggleSaveLessonPlan(
  userId: string,
  lessonPlanId: string,
): Promise<{ saved: boolean }> {
  const existing = await prisma.savedLessonPlan.findUnique({
    where: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      userId_lessonPlanId: {
        userId,
        lessonPlanId,
      },
    },
  });

  if (existing) {
    await prisma.savedLessonPlan.delete({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        userId_lessonPlanId: {
          userId,
          lessonPlanId,
        },
      },
    });
    return { saved: false };
  } else {
    await prisma.savedLessonPlan.create({
      data: {
        userId,
        lessonPlanId,
      },
    });
    return { saved: true };
  }
}

export async function getSavedLessonPlans(
  userId: string,
  filters: LessonFilters,
  skip: number,
  limit: number,
): Promise<[number, LessonPlan[]]> {
  const whereClause: Prisma.SavedLessonPlanWhereInput = {
    userId,
  };

  const lessonPlanQuery: Prisma.LessonPlanWhereInput = {};

  if (filters.ageGroup) lessonPlanQuery.ageGroup = filters.ageGroup;
  if (filters.frame) lessonPlanQuery.frame = filters.frame;

  if (filters.search !== undefined) {
    lessonPlanQuery.OR = [
      { topic: { contains: filters.search, mode: "insensitive" } },
      { unit: { contains: filters.search, mode: "insensitive" } },
      { superGoal: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (Object.keys(lessonPlanQuery).length > 0) {
    whereClause.lessonPlan = lessonPlanQuery;
  }

  const result = await Promise.all([
    prisma.savedLessonPlan.count({ where: whereClause }),
    prisma.savedLessonPlan.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { savedAt: "desc" },
      include: {
        lessonPlan: {
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                role: true,
                email: true,
              },
            },
            savedBy: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const [total, savedPlans] = result;
  return [total, savedPlans.map((sp) => sp.lessonPlan)];
}
