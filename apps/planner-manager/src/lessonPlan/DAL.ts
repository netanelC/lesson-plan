import { prisma } from '../../db/prisma/prisma';
import type { CreateLessonPlanDto } from '@repo/types';

export const lessonPlanDal = {
  async create(data: CreateLessonPlanDto, author: string) {
    return prisma.lessonPlan.create({
      data: {
        ...data, // Spread all the simple fields (topic, unit, arrays)
        author: author,
        // JSON.parse/stringify ensures proper Prisma JSON serialization
        lessonFlow: JSON.parse(JSON.stringify(data.lessonFlow)),
      },
    });
  },

  async getAll() {
    return prisma.lessonPlan.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  /**
   * Fetches a single lesson plan and "Joins" all its attachments
   */
  async getById(id: string) {
    return prisma.lessonPlan.findUnique({
      where: { id },
      include: {
        attachments: true, // This is the magic line that fetches the child table
      },
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
