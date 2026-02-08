import { z } from 'zod';

// 1. Define the Constants (The Source of Truth)
export const AGE_GROUPS = ['3-4', '4-5'] as const;
export const ACTIVITY_FRAMES = ['plenary', 'small-group'] as const;

export type AgeGroup = (typeof AGE_GROUPS)[number];
export type ActivityFrame = (typeof ACTIVITY_FRAMES)[number];

// 3. The Lesson Flow (The Table)
export interface LessonStep {
  name: string;             // e.g., "פתיחה", "גוף", "סיכום"
  durationMinutes?: number; 
  description: string;      // The actual instructions
}

// 4. Create Lesson Plan (Zod schema and DTO)
export const MIN_OPERATIVE_GOALS = 3;

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

// 5. The Main Lesson Plan Interface
export interface LessonPlan {
  id: string;
  author: string;
  createdAt: Date;
  isPublished: boolean;

  // Header Info
  topic: string;            // נושא השיחה
  unit: string;             // יחידה
  
  // Context
  frame: ActivityFrame;     // מסגרת הוראה
  ageGroup: AgeGroup;       // גיל הילדים

  // Pedagogy
  superGoal: string;        // מטרת על
  operativeGoals: string[]; // מטרות אופרטיביות (Array of strings)
  priorKnowledge?: string;  // ידע קודם

  // Preparation
  teachingAids: string[];   // אמצעי הוראה (List of items)
  references: string[];     // מקורות מידע (Links or titles)

  // The Plan
  lessonFlow: LessonStep[];
}
