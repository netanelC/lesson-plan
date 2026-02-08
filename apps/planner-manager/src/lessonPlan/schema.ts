import { z } from 'zod';
import { AGE_GROUPS, ACTIVITY_FRAMES, MIN_OPERATIVE_GOALS } from '@repo/types';

// 1. Helper Schema for a single Step
const lessonStepSchema = z.object({
  name: z.string().min(1),
  durationMinutes: z.number().optional(),
  description: z.string().min(1),
});

// 2. Main Create Schema
export const createLessonPlanSchema = z.object({
  topic: z.string().min(2),
  unit: z.string().min(2),
  
  // Enums from Shared Types
  ageGroup: z.enum(AGE_GROUPS),
  frame: z.enum(ACTIVITY_FRAMES),

  // Arrays
  superGoal: z.string().min(5),
  operativeGoals: z
    .array(z.string().min(1))
    .min(MIN_OPERATIVE_GOALS),
  priorKnowledge: z.string().optional(),
  
  teachingAids: z.array(z.string()).default([]),
  references: z.array(z.string()).default([]),

  // The Complex Table
  lessonFlow: z.array(lessonStepSchema).min(1),
});

export type CreateLessonPlanDto = z.infer<typeof createLessonPlanSchema>;
