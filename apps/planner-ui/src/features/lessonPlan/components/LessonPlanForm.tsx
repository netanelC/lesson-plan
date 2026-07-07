import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateLessonPlanSchema,
  type CreateLessonPlanBody,
  type CreateLessonPlanInput,
  AGE_GROUPS,
  ACTIVITY_FRAMES,
  FRAME_LABELS,
  AGE_LABELS,
  FIELD_LABELS,
  type AgeGroupType,
  type FrameType,
} from "@repo/types";

// UI Components
import { TextInput } from "../../../components/ui/TextInput";
import { SelectInput } from "../../../components/ui/SelectInput";
import { SectionCard } from "../../../components/ui/SectionCard";
import { FileUploader } from "../../../components/ui/FileUploader";

// Sub-components
import { OperativeGoalsSection } from "./OperativeGoalsSection";
import { TeachingAidsAndReferences } from "./TeachingAidsAndReferences";
import { LessonFlowSection } from "./LessonFlowSection";

interface Props {
  initialData?: CreateLessonPlanInput;
  existingAttachments?: { id: string; filename: string; sizeBytes: number }[];
  onRemoveExistingAttachment?: (id: string) => void;
  onSubmit: (data: CreateLessonPlanBody, files?: File[]) => Promise<void>;
  isSubmitting: boolean;
  title: string;
  submitLabel: string;
}

export const LessonPlanForm = ({
  initialData,
  existingAttachments = [],
  onRemoveExistingAttachment,
  onSubmit,
  isSubmitting,
  title,
  submitLabel,
}: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateLessonPlanInput>({
    resolver: zodResolver(CreateLessonPlanSchema),
    defaultValues: initialData ?? {
      topic: "",
      unit: "",
      ageGroup: AGE_GROUPS[0],
      frame: ACTIVITY_FRAMES[0],
      superGoal: "",
      operativeGoals: ["", "", ""],
      priorKnowledge: "",
      teachingAids: [],
      references: [],
      lessonFlow: [{ stage: "", durationMinutes: 0, description: "" }],
    },
  });

  const {
    fields: lessonFlowFields,
    append: appendFlow,
    remove: removeFlow,
  } = useFieldArray({ control, name: "lessonFlow" });

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmit(data as CreateLessonPlanBody, files),
      )}
      className="max-w-3xl mx-auto space-y-8 bg-neutral-50 p-8 rounded-xl shadow-sm border border-neutral-100"
      dir="rtl"
    >
      <header className="mb-6">
        <h2 className="text-3xl font-extrabold text-indigo-900">{title}</h2>
      </header>

      <SectionCard
        title="פרטים בסיסיים"
        theme="indigo"
        icon={
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextInput
            id="topic"
            label="נושא"
            placeholder="לדוגמה: צמחים בעונת האביב"
            {...register("topic")}
            error={errors.topic}
          />
          <TextInput
            id="unit"
            label="יחידה"
            placeholder="לדוגמה: טבע"
            {...register("unit")}
            error={errors.unit}
          />
          <SelectInput
            id="ageGroup"
            label="קבוצת גיל"
            options={AGE_GROUPS}
            getLabel={(val) => AGE_LABELS[val as AgeGroupType]}
            {...register("ageGroup")}
            error={errors.ageGroup}
          />
          <SelectInput
            id="frame"
            label="מסגרת הוראה"
            options={ACTIVITY_FRAMES}
            getLabel={(val) => FRAME_LABELS[val as FrameType]}
            {...register("frame")}
            error={errors.frame}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="מטרות"
        theme="orange"
        icon={
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        }
      >
        <OperativeGoalsSection
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />
      </SectionCard>

      <SectionCard
        title="הכנה לשיעור"
        theme="indigo"
        icon={
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        }
      >
        <TeachingAidsAndReferences
          register={register}
          watch={watch}
          setValue={setValue}
        />
      </SectionCard>

      <SectionCard
        title="חלקי השיעור"
        theme="green"
        icon={
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      >
        <LessonFlowSection
          lessonFlowFields={lessonFlowFields}
          append={appendFlow}
          remove={removeFlow}
          register={register}
          watch={watch}
          errors={errors}
        />
      </SectionCard>

      <SectionCard
        title="קבצים נלווים"
        theme="indigo"
        icon={
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        }
      >
        <FileUploader
          files={files}
          onFilesChange={setFiles}
          existingAttachments={existingAttachments}
          onRemoveExisting={onRemoveExistingAttachment}
          disabled={isSubmitting}
        />
      </SectionCard>

      <footer className="flex flex-col items-start gap-4 pt-4 border-t border-gray-100">
        {Object.keys(errors).length > 0 && (
          <div className="w-full bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg text-sm font-bold flex items-center gap-3">
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              נא לתקן את השגיאות בשדות הבאים:{" "}
              {Object.keys(errors)
                .map((key) => FIELD_LABELS[key] || key)
                .join(", ")}
            </span>
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-10 py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95 min-w-[200px]"
        >
          {isSubmitting ? "מעבד..." : submitLabel}
        </button>
      </footer>
    </form>
  );
};
