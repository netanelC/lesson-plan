/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/naming-convention */
import { z } from "zod";
import {
  AgeGroupSchema,
  type AgeGroupType,
  FrameSchema,
  type FrameType,
  LessonPlanSchema,
  UserSchema,
} from "./generated";

// Omit the fields the database handles automatically
const BaseHttpCreateSchema = LessonPlanSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  authorId: true,
});

export const LessonFlowStepSchema = z.object({
  stage: z.string().min(2, { message: "נא להזין את שם השלב (למשל: פתיחה)" }),
  durationMinutes: z
    .number()
    .positive({ message: "משך הזמן חייב להיות חיובי" }),
  description: z.string().min(5, { message: "נא להזין תיאור מפורט לשלב זה" }),
});

// Re-export all raw generated types
export * from "./generated";

// Now we can extend the base schema with our custom validation for the HTTP layer
export const CreateLessonPlanSchema = BaseHttpCreateSchema.extend({
  operativeGoals: z
    .array(
      z.string().min(2, { message: "נא להזין מטרה אופרטיבית (לפחות 2 תווים)" }),
    )
    .min(3, { message: "חובה להזין לפחות 3 מטרות אופרטיביות מלאות" }),
  lessonFlow: z
    .array(LessonFlowStepSchema)
    .min(1, { message: "חובה להזין לפחות שלב אחד במהלך השיעור" }),
  teachingAids: z.array(z.string()).default([]),
  references: z.array(z.string()).default([]),
});

export const LessonFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
  search: z.string().optional(),
  ageGroup: AgeGroupSchema.optional(),
  frame: FrameSchema.optional(),
  authorId: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.email("כתובת אימייל לא תקינה"),
  password: z.string().min(1, "חובה להזין סיסמה"),
});
export const RegisterSchema = LoginSchema.extend({
  fullName: z.string().min(2, "שם מלא חייב להכיל לפחות 2 תווים"),
});

export type CreateLessonPlanBody = z.infer<typeof CreateLessonPlanSchema>;
export type LessonFlowStep = z.infer<typeof LessonFlowStepSchema>;
export type CreateLessonPlanInput = z.input<typeof CreateLessonPlanSchema>;
export type LessonFilters = z.infer<typeof LessonFiltersSchema>;
export type User = z.infer<typeof UserSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type LessonPlan = z.infer<typeof LessonPlanSchema> & {
  author?: Pick<User, "id" | "fullName" | "role" | "email">;
};

export interface AuthResponse {
  token: string;
  user: User;
}

// Common constants/labels for UI and Backend consistency
export const AGE_LABELS = {
  THREE_TO_FOUR: "גילאי 3-4",
  FOUR_TO_FIVE: "גילאי 4-5",
} as const satisfies Record<AgeGroupType, string>;
export const AGE_GROUPS = Object.keys(AGE_LABELS) as AgeGroupType[];

export const FRAME_LABELS = {
  PLENARY: "מליאה",
  SMALL_GROUP: "קבוצה קטנה",
} as const satisfies Record<FrameType, string>;
export const ACTIVITY_FRAMES = Object.keys(FRAME_LABELS) as FrameType[];

export const FIELD_LABELS: Record<string, string> = {
  topic: "נושא",
  unit: "יחידה",
  ageGroup: "קבוצת גיל",
  frame: "מסגרת הוראה",
  superGoal: "מטרת על",
  operativeGoals: "מטרות אופרטיביות",
  priorKnowledge: "ידע קודם",
  teachingAids: "עזרי הוראה",
  references: "מקורות",
  lessonFlow: "חלקי השיעור",
};
