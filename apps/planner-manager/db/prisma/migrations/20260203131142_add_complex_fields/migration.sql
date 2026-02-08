/*
  Warnings:

  - Added the required column `ageGroup` to the `LessonPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frame` to the `LessonPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonFlow` to the `LessonPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `superGoal` to the `LessonPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LessonPlan" ADD COLUMN     "ageGroup" TEXT NOT NULL,
ADD COLUMN     "frame" TEXT NOT NULL,
ADD COLUMN     "lessonFlow" JSONB NOT NULL,
ADD COLUMN     "operativeGoals" TEXT[],
ADD COLUMN     "priorKnowledge" TEXT,
ADD COLUMN     "references" TEXT[],
ADD COLUMN     "superGoal" TEXT NOT NULL,
ADD COLUMN     "teachingAids" TEXT[];
