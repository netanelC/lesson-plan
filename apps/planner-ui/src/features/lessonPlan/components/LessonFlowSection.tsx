import type { FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove, UseFormRegister, UseFormWatch } from "react-hook-form";
import type { CreateLessonPlanInput } from "@repo/types";
import { TextInput } from "../../../components/ui/TextInput";

interface LessonFlowSectionProps {
  lessonFlowFields: { id: string }[];
  append: UseFieldArrayAppend<CreateLessonPlanInput, "lessonFlow">;
  remove: UseFieldArrayRemove;
  register: UseFormRegister<CreateLessonPlanInput>;
  watch: UseFormWatch<CreateLessonPlanInput>;
  errors: FieldErrors<CreateLessonPlanInput>;
}

export const LessonFlowSection = ({ lessonFlowFields, append, remove, register, errors }: LessonFlowSectionProps) => {
  return (
    <div className="space-y-4">
      {lessonFlowFields.map((field, index) => (
        <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start bg-white p-4 rounded-md border border-gray-100 shadow-sm">
          <div className="flex-1 w-full">
            <TextInput
              label={index === 0 ? "שם החלק" : ""}
              placeholder="לדוגמה: פתיחה"
              {...register(`lessonFlow.${index}.stage` as const)} // <-- Changed from .name to .stage
              error={errors.lessonFlow?.[index]?.stage}
            />
          </div>
          <div className="w-full sm:w-24">
            <TextInput
              label={index === 0 ? "דק׳" : ""}
              type="number"
              placeholder="לדוגמה: 5"
              {...register(`lessonFlow.${index}.durationMinutes` as const, { valueAsNumber: true })}
              error={errors.lessonFlow?.[index]?.durationMinutes}
            />
          </div>
          <div className="flex-[2] w-full">
            <TextInput
              label={index === 0 ? "תיאור הפעילות" : ""}
              placeholder="לדוגמה: שיחה עם התלמידים על הנושא"
              {...register(`lessonFlow.${index}.description` as const)}
              error={errors.lessonFlow?.[index]?.description}
            />
          </div>
          <button type="button" onClick={() => remove(index)} disabled={lessonFlowFields.length <= 1} className="mt-0 sm:mt-8 p-2 text-gray-400 hover:text-red-600">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ stage: "", durationMinutes: 0, description: "" })} className="w-full py-2 border-2 border-dashed text-indigo-600">
        + הוסיפי חלק חדש
      </button>
    </div>
  );
};
