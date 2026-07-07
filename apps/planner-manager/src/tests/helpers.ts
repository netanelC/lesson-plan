import { prisma } from "../db/prisma/prisma";

export async function clearDb(): Promise<void> {
  await prisma.attachment.deleteMany();
  await prisma.lessonPlan.deleteMany();
  await prisma.user.deleteMany();
}
