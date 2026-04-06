import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateLessonPlanSchema, type CreateLessonPlanBody, type CreateLessonPlanInput } from "@repo/types";

// UI Components
import { TextInput } from "../../../components/ui/TextInput";
import { SelectInput } from "../../../components/ui/SelectInput";
import { SectionCard } from "../../../components/ui/SectionCard";
import { FileUploader } from "../../../components/ui/FileUploader";

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
  initialData?: CreateLessonPlanInput;
  onSubmit: (data: CreateLessonPlanBody, files?: File[]) => Promise<void>;
  isSubmitting: boolean;
  title: string;
  submitLabel: string;
}

export const LessonPlanForm = ({ initialData, onSubmit, isSubmitting, title, submitLabel }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm<CreateLessonPlanInput>({
    resolver: zodResolver(CreateLessonPlanSchema),
    defaultValues: initialData ?? {
      topic: "",
      unit: "",
      ageGroup: "THREE_TO_FOUR",
      frame: "PLENARY",
      superGoal: "",
      operativeGoals: ["", "", ""],
      priorKnowledge: "",
      teachingAids: [],
      references: [],
      lessonFlow: [{ stage: "", durationMinutes: 0, description: "" }],
    },
  });

  const { fields: lessonFlowFields, append: appendFlow, remove: removeFlow } = useFieldArray({ control, name: "lessonFlow" });

  return (
    <form 
      onSubmit={handleSubmit((data) => onSubmit(data as CreateLessonPlanBody, files))}
      className="max-w-3xl mx-auto space-y-8 bg-neutral-50 p-8 rounded-xl shadow-sm border border-neutral-100" 
      dir="rtl"
    >
      <header className="mb-6"><h2 className="text-3xl font-extrabold text-indigo-900">{title}</h2></header>

      <SectionCard 
        title="פרטים בסיסיים" 
        theme="indigo" 
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextInput id="topic" label="נושא" placeholder="לדוגמה: צמחים בעונת האביב" {...register("topic")} error={errors.topic} />
          <TextInput id="unit" label="יחידה" placeholder="לדוגמה: טבע" {...register("unit")} error={errors.unit} />
          <SelectInput id="ageGroup" label="קבוצת גיל" options={AGE_GROUPS} getLabel={(val) => AGE_LABELS[val]} {...register("ageGroup")} error={errors.ageGroup} />
          <SelectInput id="frame" label="מסגרת הוראה" options={ACTIVITY_FRAMES} getLabel={(val) => FRAME_LABELS[val]} {...register("frame")} error={errors.frame} />
        </div>
      </SectionCard>

      <SectionCard 
        title="מטרות" 
        theme="orange" 
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
      >
        <OperativeGoalsSection register={register} watch={watch} setValue={setValue} errors={errors} />
      </SectionCard>

      <SectionCard 
        title="הכנה לשיעור" 
        theme="indigo" 
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
      >
        <TeachingAidsAndReferences register={register} watch={watch} setValue={setValue} />
      </SectionCard>

      <SectionCard 
        title="חלקי השיעור" 
        theme="green" 
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      >
        <LessonFlowSection lessonFlowFields={lessonFlowFields} append={appendFlow} remove={removeFlow} register={register} watch={watch} errors={errors} />
      </SectionCard>

      <SectionCard 
        title="קבצים נלווים" 
        theme="indigo" 
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>}
      >
        <FileUploader files={files} onFilesChange={setFiles} disabled={isSubmitting} />
      </SectionCard>

      <footer className="flex justify-start pt-4">
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-10 py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95">
          {isSubmitting ? "מעבד..." : submitLabel}
        </button>
      </footer>
    </form>
  );
};