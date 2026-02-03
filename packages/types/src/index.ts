// 1. Define the Constants (The Source of Truth)
export const AGE_GROUPS = ['3-4', '4-5'] as const;
export const ACTIVITY_FRAMES = ['plenary', 'small-group'] as const;

// 2. Derive the Types from the Constants automatically
export type AgeGroup = typeof AGE_GROUPS;
export type ActivityFrame = typeof ACTIVITY_FRAMES;

// 3. The Lesson Flow (The Table)
export interface LessonStep {
  name: string;             // e.g., "פתיחה", "גוף", "סיכום"
  durationMinutes?: number; 
  description: string;      // The actual instructions
}

// 4. The Main Lesson Plan Interface
export interface LessonPlan {
  id: string;
  author: string;
  createdAt: Date;
  isPublished: boolean;

  // Header Info
  topic: string;            // נושא השיחה
  unit: string;             // יחידה
  
  // // Context
  // frame: ActivityFrame;     // מסגרת הוראה
  // ageGroup: AgeGroup;       // גיל הילדים

  // // Pedagogy
  // superGoal: string;        // מטרת על
  // operativeGoals: string[]; // מטרות אופרטיביות (Array of strings)
  // priorKnowledge?: string;  // ידע קודם

  // // Preparation
  // teachingAids: string[];   // אמצעי הוראה (List of items)
  // references: string[];     // מקורות מידע (Links or titles)

  // // The Plan
  // lessonFlow: LessonStep[];
}
