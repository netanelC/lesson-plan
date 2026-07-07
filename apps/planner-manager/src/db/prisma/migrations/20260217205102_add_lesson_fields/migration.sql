/*
  Warnings:

  - Added the required column `ageGroup` to the `LessonPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frame` to the `LessonPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `superGoal` to the `LessonPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `LessonPlan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Frame" AS ENUM ('PLENARY', 'SMALL_GROUP');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('THREE_TO_FOUR', 'FOUR_TO_FIVE');

-- AlterTable
ALTER TABLE "LessonPlan" ADD COLUMN     "ageGroup" "AgeGroup" NOT NULL,
ADD COLUMN     "frame" "Frame" NOT NULL,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "operativeGoals" TEXT[],
ADD COLUMN     "superGoal" TEXT NOT NULL,
ADD COLUMN     "unit" TEXT NOT NULL;
