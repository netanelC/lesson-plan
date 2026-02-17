-- AlterTable
ALTER TABLE "LessonPlan" ADD COLUMN     "references" TEXT[],
ADD COLUMN     "teachingAids" TEXT[],
ALTER COLUMN "isPublished" SET DEFAULT true;
