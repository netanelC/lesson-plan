/*
  Warnings:

  - Added the required column `lessonFlow` to the `LessonPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LessonPlan" ADD COLUMN     "lessonFlow" JSONB NOT NULL,
ALTER COLUMN "isPublished" SET DEFAULT false;
