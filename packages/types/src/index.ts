import { z } from 'zod';

// =========================================
// 1. User & Authentication (NEW)
// =========================================

export const USER_ROLES = ['OWNER', 'ADMIN', 'KINDERGARTEN'] as const;
export type UserRole = (typeof USER_ROLES)[number];

// The "Safe" User object sent to the frontend (no password/googleId)
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string | null;
}

// Zod Schemas for Auth Forms
export const LoginSchema = z.object({
  email: z.email('כתובת אימייל לא תקינה'),
  password: z.string().min(1, 'חובה להזין סיסמה'),
});
export type LoginDto = z.infer<typeof LoginSchema>;

export const RegisterSchema = LoginSchema.extend({
  fullName: z.string().min(2, 'שם מלא חייב להכיל לפחות 2 תווים'),
});
export type RegisterDto = z.infer<typeof RegisterSchema>;

export interface AuthResponse {
  token: string;
  user: User;
}

// =========================================
// 2. Lesson Plan Constants
// =========================================
export const AGE_GROUPS = ['3-4', '4-5'] as const;
export const ACTIVITY_FRAMES = ['plenary', 'small-group'] as const;

export type AgeGroup = (typeof AGE_GROUPS)[number];
export type ActivityFrame = (typeof ACTIVITY_FRAMES)[number];

// =========================================
// 3. Sub-Entities (Steps, Attachments)
// =========================================
export interface LessonStep {
  name: string;             // e.g., "פתיחה", "גוף", "סיכום"
  durationMinutes?: number; 
  description: string;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  fileType: string;
  sizeBytes: number;
  lessonPlanId?: string;
}

// =========================================
// 4. Create Lesson Plan (Zod schema and DTO)
// =========================================
export const MIN_OPERATIVE_GOALS = 3; // Ensure this matches UI validation logic

const lessonStepSchema = z.object({
  name: z.string().min(1, 'יש למלא את שם שלב השיעור'),
  durationMinutes: z
    .number()
    .optional()
    .transform((v) => (v === undefined || Number.isNaN(v) ? undefined : v)),
  description: z.string().min(1, 'יש למלא את תיאור שלב השיעור'),
});

export const CreateLessonPlanSchema = z.object({
  topic: z.string().min(2, 'יש למלא את נושא השיחה'),
  unit: z.string().min(2, 'יש למלא את יחידת הלימוד'),
  ageGroup: z.enum(AGE_GROUPS),
  frame: z.enum(ACTIVITY_FRAMES),
  superGoal: z.string().min(5, 'יש למלא את מטרת העל'),
  operativeGoals: z
    .array(z.string().min(1, 'יש למלא את המטרה'))
    .min(
      MIN_OPERATIVE_GOALS,
      `נדרשות לפחות ${MIN_OPERATIVE_GOALS} מטרות אופרטיביות`
    ),
  priorKnowledge: z.string().optional(),
  teachingAids: z.array(z.string()),
  references: z.array(z.string()),
  lessonFlow: z.array(lessonStepSchema).min(1),
});

export type CreateLessonPlanDto = z.infer<typeof CreateLessonPlanSchema>;

// =========================================
// 5. The Main Lesson Plan Interface
// =========================================
export interface LessonPlan {
  id: string;
  
  authorId: string;
  author?: User;

  createdAt: Date | string;
  updatedAt?: Date | string;
  isPublished: boolean;

  // Header Info
  topic: string;            // נושא השיחה
  unit: string;             // יחידה
  
  // Context
  frame: ActivityFrame;     // מסגרת הוראה
  ageGroup: AgeGroup;       // גיל הילדים

  // Pedagogy
  superGoal: string;        // מטרת על
  operativeGoals: string[]; // מטרות אופרטיביות
  priorKnowledge?: string;  // ידע קודם

  // Preparation
  teachingAids: string[];   // אמצעי הוראה
  references: string[];     // מקורות מידע

  // The Plan
  lessonFlow: LessonStep[];
  attachments?: Attachment[];
}
