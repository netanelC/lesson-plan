/* eslint-disable @typescript-eslint/naming-convention */
import { AgeGroup as DtoAgeGroup, ActivityFrame as DtoFrame } from "@repo/types";
import { AgeGroup as PrismaAgeGroup, Frame as PrismaFrame } from "../db/prisma/generated/client";

// ==========================================
// 1. DTO -> Database (For Creating/Updating)
// ==========================================
export const mapAgeGroupToDb: Record<DtoAgeGroup, PrismaAgeGroup> = {
  "3-4": "AG_3_4",
  "4-5": "AG_4_5",
};

export const mapFrameToDb: Record<DtoFrame, PrismaFrame> = {
  "plenary": "PLENARY",
  "small-group": "SMALL_GROUP",
};

// ==========================================
// 2. Database -> DTO (For fetching and returning to UI)
// ==========================================
export const mapAgeGroupToDto: Record<PrismaAgeGroup, DtoAgeGroup> = {
  AG_3_4: "3-4",
  AG_4_5: "4-5",
};

export const mapFrameToDto: Record<PrismaFrame, DtoFrame> = {
  PLENARY: "plenary",
  SMALL_GROUP: "small-group",
};