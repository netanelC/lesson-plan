/*
  Warnings:

  - A unique constraint covering the columns `[authorId]` on the table `LessonPlan` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `ageGroup` on the `LessonPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `frame` on the `LessonPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('AG_3_4', 'AG_4_5');

-- CreateEnum
CREATE TYPE "Frame" AS ENUM ('PLENARY', 'SMALL_GROUP');

-- AlterTable
ALTER TABLE "LessonPlan" DROP COLUMN "ageGroup",
ADD COLUMN     "ageGroup" "AgeGroup" NOT NULL,
DROP COLUMN "frame",
ADD COLUMN     "frame" "Frame" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LessonPlan_authorId_key" ON "LessonPlan"("authorId");
