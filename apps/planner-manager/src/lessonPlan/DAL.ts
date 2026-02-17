import type { 
  CreateLessonPlanDto, 
  LessonPlan, 
  LessonFilters, 
  PaginationMeta,
  UserRole
} from "@repo/types";
import config from "config";
import { Prisma } from "../db/prisma/generated/client";
import { prisma } from "../db/prisma/prisma";
import { 
  mapAgeGroupToDb, 
  mapFrameToDb, 
  mapAgeGroupToDto, 
  mapFrameToDto 
} from "./mapper";

const PAGE_LIMIT = config.get<number>("page.limit");

// ==========================================
// Reusable Mapper: Prisma -> DTO
// ==========================================
// This ensures every DAL method returns the exact same clean shape
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToSharedLessonPlan = (prismaLesson: any): LessonPlan => {
  return {
    ...prismaLesson,
    // Translate Prisma Enums to UI Strings
    ageGroup: mapAgeGroupToDto[prismaLesson.ageGroup],
    frame: mapFrameToDto[prismaLesson.frame],
    // Translate Dates to ISO Strings
    createdAt: prismaLesson.createdAt.toISOString(),
    updatedAt: prismaLesson.updatedAt.toISOString(),
    // Map Author if it was included in the query
    ...(prismaLesson.author && {
      author: {
        id: prismaLesson.author.id,
        email: prismaLesson.author.email,
        fullName: prismaLesson.author.fullName,
        role: prismaLesson.author.role as UserRole,
        avatarUrl: prismaLesson.author.avatarUrl,
        createdAt: prismaLesson.author.createdAt.toISOString(),
      },
    }),
    // Attachments can be passed through safely if they exist
    ...(prismaLesson.attachments && {
      attachments: prismaLesson.attachments,
    }),
  };
};

export const lessonPlanDal = {
  async create(data: CreateLessonPlanDto, userId: string): Promise<LessonPlan> {
    const newLesson = await prisma.lessonPlan.create({
      data: {
        topic: data.topic,
        unit: data.unit,
        superGoal: data.superGoal,
        operativeGoals: data.operativeGoals,
        priorKnowledge: data.priorKnowledge,
        teachingAids: data.teachingAids,
        references: data.references,
        
        // 1. Translate UI strings to DB enums
        ageGroup: mapAgeGroupToDb[data.ageGroup],
        frame: mapFrameToDb[data.frame],
        
        author: {
          connect: { id: userId },
        },
        
        // 2. Clean cast instead of the JSON.parse(JSON.stringify) hack
        lessonFlow: data.lessonFlow as unknown as Prisma.InputJsonValue,
      },
      include: { author: true },
    });

    return mapToSharedLessonPlan(newLesson);
  },

  // Notice the strict return type for your pagination!
  async getAll(filters: LessonFilters = {}): Promise<{ data: LessonPlan[]; meta: PaginationMeta }> {
    const { search, ageGroup, frame, authorId, page = 1, limit = PAGE_LIMIT } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.LessonPlanWhereInput = { isPublished: true };

    // Translate UI filter strings to DB Enums before querying
    if (ageGroup) where.ageGroup = mapAgeGroupToDb[ageGroup];
    if (frame) where.frame = mapFrameToDb[frame];
    if (authorId) where.authorId = authorId;
    if (search) {
      where.OR = [
        { topic: { contains: search, mode: "insensitive" } },
        { superGoal: { contains: search, mode: "insensitive" } },
        { unit: { contains: search, mode: "insensitive" } },
      ];
    }

    const [totalItems, rawData] = await Promise.all([
      prisma.lessonPlan.count({ where }),
      prisma.lessonPlan.findMany({
        where,
        skip,
        take: limit,
        include: { author: { select: { fullName: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      // Run all results through the mapper
      data: rawData.map(mapToSharedLessonPlan),
      meta: {
        totalItems,
        itemCount: rawData.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  },

  async getById(id: string): Promise<LessonPlan | null> {
    const lesson = await prisma.lessonPlan.findUnique({
      where: { id },
      include: {
        author: true,
        attachments: true,
      },
    });

    if (!lesson) return null;
    return mapToSharedLessonPlan(lesson);
  },

  async update(id: string, data: Partial<CreateLessonPlanDto>): Promise<LessonPlan> {
    const updatedLesson = await prisma.lessonPlan.update({
      where: { id },
      data: {
        ...data,
        // Only map these if they were actually provided in the partial update
        ...(data.ageGroup && { ageGroup: mapAgeGroupToDb[data.ageGroup] }),
        ...(data.frame && { frame: mapFrameToDb[data.frame] }),
        ...(data.lessonFlow && { lessonFlow: data.lessonFlow as unknown as Prisma.InputJsonValue }),
      },
    });

    return mapToSharedLessonPlan(updatedLesson);
  },

  async delete(id: string): Promise<void> {
    await prisma.lessonPlan.delete({
      where: { id },
    });
  },

  // --- Attachment Methods (Kept clean) ---

  async addAttachment(
    lessonPlanId: string,
    fileInfo: {
      filename: string;
      url: string;
      fileType: string;
      sizeBytes: number;
    },
  ) {
    return prisma.attachment.create({
      data: {
        ...fileInfo,
        lessonPlanId,
      },
    });
  },

  async deleteAttachment(id: string): Promise<void> {
    await prisma.attachment.delete({
      where: { id },
    });
  },
};
