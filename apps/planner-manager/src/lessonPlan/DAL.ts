import { prisma } from '../../db/prisma/prisma';
import type { CreateLessonPlanDto } from '@repo/types';
import { LessonFilters } from '@repo/types';
import { Prisma } from 'db/generated/prisma';

export const lessonPlanDal = {
  async create(data: CreateLessonPlanDto, userId: string) {
    return prisma.lessonPlan.create({
      data: {
        ...data, // Spread all the simple fields (topic, unit, arrays)
        author: {
          connect: { id: userId } 
        },
        // JSON.parse/stringify ensures proper Prisma JSON serialization
        lessonFlow: JSON.parse(JSON.stringify(data.lessonFlow)),
      },
    });
  },

  async getAll(filters: LessonFilters = {}) {
    const { search, ageGroup, frame, authorId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.LessonPlanWhereInput = { isPublished: true };

    if (ageGroup) where.ageGroup = ageGroup;
    if (authorId) where.authorId = authorId;
    if (frame) where.frame = frame;
    if (search) {
      where.OR = [
        { topic: { contains: search, mode: 'insensitive' } },
        { superGoal: { contains: search, mode: 'insensitive' } },
        { unit: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute count and data fetch in parallel for performance
    const [totalItems, data] = await Promise.all([
      prisma.lessonPlan.count({ where }),
      prisma.lessonPlan.findMany({
        where,
        skip,
        take: limit,
        include: { author: { select: { fullName: true } } },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
      }
    };
  },

  /**
   * Fetches a single lesson plan and "Joins" all its attachments
   */
  async getById(id: string) {
    return prisma.lessonPlan.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            avatarUrl: true
          }
        },
        attachments: true
      }
    });
  },

  async update(id: string, data: CreateLessonPlanDto) {
    return prisma.lessonPlan.update({
      where: { id },
      data: {
        ...data,
        // JSON.parse/stringify ensures proper Prisma JSON serialization
        lessonFlow: JSON.parse(JSON.stringify(data.lessonFlow)),
      },
    });
  },

  async delete(id: string) {
    return prisma.lessonPlan.delete({
      where: { id },
    });
  },

  async addAttachment(lessonPlanId: string, fileInfo: { filename: string, url: string, fileType: string, sizeBytes: number }) {
    return prisma.attachment.create({
      data: {
        ...fileInfo,
        lessonPlanId
      }
    });
  },

  async getWithAttachments(id: string) {
    return prisma.lessonPlan.findUnique({
      where: { id },
      include: { attachments: true } // This "joins" the tables automatically
    });
  },

  async getAttachmentById(id: string) {
    return prisma.attachment.findUnique({
      where: { id },
    });
  },

  async deleteAttachment(id: string) {
    return prisma.attachment.delete({
      where: { id },
    });
  },
};
