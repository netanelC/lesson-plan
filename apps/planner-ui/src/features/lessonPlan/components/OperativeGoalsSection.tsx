import type { UseFormSetValue, UseFormWatch, UseFormRegister, FieldErrors } from "react-hook-form";
import type { CreateLessonPlanInput } from "@repo/types";
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
        <TextInput id="superGoal" label="מטרת על" {...register("superGoal")} error={errors.superGoal} />
      </div>
      <div className="space-y-3">
        {goals.map((_, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-1">
              <TextInput label="" {...register(`operativeGoals.${index}` as const)} error={errors.operativeGoals?.[index]} />
            </div>
            <button type="button" onClick={() => setValue("operativeGoals", goals.filter((_, i) => i !== index))} disabled={goals.length <= MIN_OPERATIVE_GOALS} className="mt-1 p-2 text-red-500">✕</button>
          </div>
        ))}
        <button type="button" onClick={() => setValue("operativeGoals", [...goals, ""])} className="text-indigo-600 text-sm font-medium">+ הוסיפי מטרה נוספת</button>
      </div>
    </div>
  );
};
