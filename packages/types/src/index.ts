import { z } from "zod";

// =========================================
// 1. Internal Constants & Configurations
// =========================================
const MIN_STRING_LENGTH = 2;
const MAX_DURATION_MINUTES = 60;
const MIN_DURATION_MINUTES = 1;

// =========================================
// 2. Exportable Constants
// =========================================
const MIN_OPERATIVE_GOALS = 3;
const USER_ROLES = ["OWNER", "ADMIN", "KINDERGARTEN"] as const;
const AGE_GROUPS = ["3-4", "4-5"] as const;
const ACTIVITY_FRAMES = ["plenary", "small-group"] as const;

// =========================================
// 3. Base & Utility Types
// =========================================
type UserRole = (typeof USER_ROLES)[number];
type AgeGroup = (typeof AGE_GROUPS)[number];
type ActivityFrame = (typeof ACTIVITY_FRAMES)[number];

interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

type ApiResponse<T> =
  | { success: true; data: T; meta?: PaginationMeta }
  | { success: false; error: string; message: string; statusCode: number };

// =========================================
// 4. Filters
// =========================================
interface BaseFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface LessonFilters extends BaseFilters {
  ageGroup?: AgeGroup | "";
  frame?: ActivityFrame | "";
  authorId?: string;
}

interface UserFilters extends BaseFilters {
  role?: UserRole;
}

// =========================================
// 5. Zod Schemas
// =========================================
const loginSchema = z.object({
  email: z.email("כתובת אימייל לא תקינה"),
  password: z.string().min(1, "חובה להזין סיסמה"),
});

const registerSchema = loginSchema.extend({
  fullName: z
    .string()
    .min(MIN_STRING_LENGTH, "שם מלא חייב להכיל לפחות 2 תווים"),
});

const googleLoginSchema = z.object({
  token: z.string().min(1, "Google token is required"),
});

const updateUserRoleSchema = z.object({
  role: z.enum(USER_ROLES),
});

const lessonStepSchema = z.object({
  name: z.string().min(1, "יש למלא את שם שלב השיעור"),
  durationMinutes: z
    .number()
    .min(
      MIN_DURATION_MINUTES,
      `משך זמן חייב להיות לפחות ${MIN_DURATION_MINUTES} דקה`,
    )
    .max(
      MAX_DURATION_MINUTES,
      `משך זמן לא יכול להעלות על ${MAX_DURATION_MINUTES} דקות`,
    ),
  description: z.string().min(MIN_STRING_LENGTH, "יש למלא את תיאור שלב השיעור"),
});

const createLessonPlanSchema = z.object({
  topic: z.string().min(MIN_STRING_LENGTH, "יש למלא את נושא השיחה"),
  unit: z.string().min(MIN_STRING_LENGTH, "יש למלא את יחידת הלימוד"),
  ageGroup: z.enum(AGE_GROUPS),
  frame: z.enum(ACTIVITY_FRAMES),
  superGoal: z.string().min(MIN_STRING_LENGTH, "יש למלא את מטרת העל"),
  operativeGoals: z
    .array(z.string().min(1, "יש למלא את המטרה"))
    .min(
      MIN_OPERATIVE_GOALS,
      `נדרשות לפחות ${MIN_OPERATIVE_GOALS} מטרות אופרטיביות`,
    ),
  priorKnowledge: z.string().optional(),
  teachingAids: z.array(z.string()),
  references: z.array(z.string()),
  lessonFlow: z.array(lessonStepSchema).min(1),
});

const updateLessonPlanSchema = createLessonPlanSchema.partial();

// =========================================
// 6. DTOs & Domain Interfaces
// =========================================
type LoginDto = z.infer<typeof loginSchema>;
type RegisterDto = z.infer<typeof registerSchema>;
type GoogleLoginDto = z.infer<typeof googleLoginSchema>;
type UpdateUserRoleDto = z.infer<typeof updateUserRoleSchema>;
type CreateLessonPlanDto = z.infer<typeof createLessonPlanSchema>;
type UpdateLessonPlanDto = z.infer<typeof updateLessonPlanSchema>;

interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string | null;
  createdAt: string;
}

interface Attachment {
  id: string;
  filename: string;
  url: string;
  fileType: string;
  sizeBytes: number;
  lessonPlanId?: string;
}

interface LessonPlan extends CreateLessonPlanDto {
  id: string;
  authorId: string;
  author?: User;
  createdAt: Date | string;
  updatedAt?: Date | string;
  isPublished: boolean;
  attachments?: Attachment[];
}

// =========================================
// 7. Exports
// =========================================
export {
  // Constants
  MIN_OPERATIVE_GOALS,
  USER_ROLES,
  AGE_GROUPS,
  ACTIVITY_FRAMES,

  // Base & Utility Types
  type UserRole,
  type AgeGroup,
  type ActivityFrame,
  type PaginationMeta,
  type ApiResponse,

  // Filters
  type LessonFilters,
  type UserFilters,

  // Zod Schemas
  loginSchema,
  registerSchema,
  googleLoginSchema,
  updateUserRoleSchema,
  createLessonPlanSchema,
  updateLessonPlanSchema,

  // DTOs & Domain Interfaces
  type LoginDto,
  type RegisterDto,
  type GoogleLoginDto,
  type UpdateUserRoleDto,
  type CreateLessonPlanDto,
  type UpdateLessonPlanDto,
  type User,
  type Attachment,
  type LessonPlan,
};
