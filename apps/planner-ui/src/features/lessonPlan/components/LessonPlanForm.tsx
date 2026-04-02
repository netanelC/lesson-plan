import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateLessonPlanSchema, type CreateLessonPlanBody, type CreateLessonPlanInput } from "@repo/types";

// UI Components
import { TextInput } from "../../../components/ui/TextInput";
import { SelectInput } from "../../../components/ui/SelectInput";
import { SectionCard } from "../../../components/ui/SectionCard";

// Sub-components
import { OperativeGoalsSection } from "./OperativeGoalsSection";
import { TeachingAidsAndReferences } from "./TeachingAidsAndReferences";
import { LessonFlowSection } from "./LessonFlowSection";

// Map directly to the Prisma Enums we created earlier!
const AGE_GROUPS = ["THREE_TO_FOUR", "FOUR_TO_FIVE"] as const;
const ACTIVITY_FRAMES = ["PLENARY", "SMALL_GROUP"] as const;
const FRAME_LABELS: Record<string, string> = { PLENARY: "מליאה", SMALL_GROUP: "קבוצה קטנה" };
const AGE_LABELS: Record<string, string> = { THREE_TO_FOUR: "גילאי 3-4", FOUR_TO_FIVE: "גילאי 4-5" };

interface Props {
  onSubmit: (data: CreateLessonPlanBody) => Promise<void>;
  isSubmitting: boolean;
  title: string;
  submitLabel: string;
}

interface Props {
  onSubmit: (data: CreateLessonPlanBody) => Promise<void>;
  isSubmitting: boolean;
  title: string;
  submitLabel: string;
}

export const LessonPlanForm = ({ onSubmit, isSubmitting, title, submitLabel }: Props) => {
  const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm<CreateLessonPlanInput>({
    resolver: zodResolver(CreateLessonPlanSchema),
    defaultValues: {
      topic: "",
      unit: "",
      ageGroup: "THREE_TO_FOUR",
      frame: "PLENARY",
      superGoal: "",
      operativeGoals: ["", "", ""],
      teachingAids: [],
      references: [],
      lessonFlow: [{ stage: "", durationMinutes: 0, description: "" }],
    },
  });

  const { fields: lessonFlowFields, append: appendFlow, remove: removeFlow } = useFieldArray({ control, name: "lessonFlow" });

  return (
    <form 
      onSubmit={handleSubmit((data) => onSubmit(data as CreateLessonPlanBody))}
      className="max-w-3xl mx-auto space-y-8 bg-neutral-50 p-8 rounded-xl shadow-sm border border-neutral-100" 
      dir="rtl"
    >
      <header className="mb-6"><h2 className="text-3xl font-extrabold text-indigo-900">{title}</h2></header>

      <SectionCard title="פרטים בסיסיים" theme="indigo" icon={<span/>}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextInput id="topic" label="נושא" {...register("topic")} error={errors.topic} />
          <TextInput id="unit" label="יחידה" {...register("unit")} error={errors.unit} />
          <SelectInput id="ageGroup" label="קבוצת גיל" options={AGE_GROUPS} getLabel={(val) => AGE_LABELS[val]} {...register("ageGroup")} error={errors.ageGroup} />
          <SelectInput id="frame" label="מסגרת הוראה" options={ACTIVITY_FRAMES} getLabel={(val) => FRAME_LABELS[val]} {...register("frame")} error={errors.frame} />
        </div>
      </SectionCard>

      <SectionCard title="מטרות" theme="orange" icon={<span/>}>
        <OperativeGoalsSection register={register} watch={watch} setValue={setValue} errors={errors} />
      </SectionCard>

      <SectionCard title="הכנה לשיעור" theme="indigo" icon={<span/>}>
        <TeachingAidsAndReferences register={register} watch={watch} setValue={setValue} />
      </SectionCard>

      <SectionCard title="חלקי השיעור" theme="green" icon={<span/>}>
        <LessonFlowSection lessonFlowFields={lessonFlowFields} append={appendFlow} remove={removeFlow} register={register} watch={watch} errors={errors} />
      </SectionCard>

      <footer className="flex justify-start pt-4">
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-10 py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95">
          {isSubmitting ? "מעבד..." : submitLabel}
        </button>
      </footer>
    </form>
  );
};