/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/naming-convention */
import { z } from "zod";
import { LessonPlanSchema } from "./generated";

// Omit the fields the database handles automatically
const BaseHttpCreateSchema = LessonPlanSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const LessonFlowStepSchema = z.object({
  stage: z.string().min(2, { message: "נא להזין את שם השלב (למשל: פתיחה)" }),
  durationMinutes: z.number().positive({ message: "משך הזמן חייב להיות חיובי" }),
  description: z.string().min(5, { message: "נא להזין תיאור מפורט לשלב זה" }),
});

// Re-export all raw generated types
export * from "./generated";

// Now we can extend the base schema with our custom validation for the HTTP layer
export const CreateLessonPlanSchema = BaseHttpCreateSchema.extend({
  operativeGoals: z
    .array(z.string())
    .min(3, { message: "חובה להזין לפחות 3 מטרות אופרטיביות" }),
  lessonFlow: z
    .array(LessonFlowStepSchema)
    .min(1, { message: "חובה להזין לפחות שלב אחד במהלך השיעור" }),
  teachingAids: z.array(z.string()).default([]),
  references: z.array(z.string()).default([]),
});

export type CreateLessonPlanBody = z.infer<typeof CreateLessonPlanSchema>;
export type LessonFlowStep = z.infer<typeof LessonFlowStepSchema>;
export type CreateLessonPlanInput = z.input<typeof CreateLessonPlanSchema>;
