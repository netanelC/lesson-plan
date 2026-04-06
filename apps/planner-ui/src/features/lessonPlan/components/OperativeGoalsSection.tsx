import type { UseFormSetValue, UseFormWatch, UseFormRegister, FieldErrors } from "react-hook-form";
import type { CreateLessonPlanInput } from "@repo/types";
import { clsx } from "clsx";
import { TextInput } from "../../../components/ui/TextInput";

const MIN_OPERATIVE_GOALS = 3;

interface OperativeGoalsSectionProps {
  register: UseFormRegister<CreateLessonPlanInput>;
  watch: UseFormWatch<CreateLessonPlanInput>;
  setValue: UseFormSetValue<CreateLessonPlanInput>;
  errors: FieldErrors<CreateLessonPlanInput>;
}

export const OperativeGoalsSection = ({ register, watch, setValue, errors }: OperativeGoalsSectionProps) => {
  const goals = watch("operativeGoals");

  return (
    <div className="space-y-4">
      <div>
        <TextInput id="superGoal" label="מטרת על" placeholder="לדוגמה: התלמידים יבינו את חשיבות ההגנה על הטבע" {...register("superGoal")} error={errors.superGoal} />
      </div>
      <div className="space-y-3 mt-6">
        <label className="block text-sm font-bold text-gray-800 mb-2">מטרות אופרטיביות</label>
        {goals.map((_, index) => {
          const isRemovable = goals.length > MIN_OPERATIVE_GOALS;
          return (
            <div key={index} className="flex gap-3">
              <div className="flex-1">
                <TextInput label="" placeholder="לדוגמה: התלמיד יוכל לזהות סוגי צמחים" {...register(`operativeGoals.${index}` as const)} error={errors.operativeGoals?.[index]} />
              </div>
              <button 
                type="button" 
                onClick={() => setValue("operativeGoals", goals.filter((_, i) => i !== index))} 
                disabled={!isRemovable} 
                className={clsx(
                  "mt-1 p-2 rounded transition-colors flex items-center justify-center",
                  isRemovable ? "text-red-500 hover:bg-red-50" : "text-gray-300 cursor-not-allowed"
                )}
                aria-label="מחק מטרה"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          );
        })}
        <button type="button" onClick={() => setValue("operativeGoals", [...goals, ""])} className="text-indigo-600 text-sm font-medium">+ הוסיפי מטרה נוספת</button>
      </div>
    </div>
  );
};
