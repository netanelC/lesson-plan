import { useState } from 'react';
import { useForm, useFieldArray, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateLessonPlanSchema,
  type CreateLessonPlanDto,
  AGE_GROUPS,
  ACTIVITY_FRAMES,
  MIN_OPERATIVE_GOALS,
} from '@repo/types';

// Hooks
import { useCreateLessonPlan } from '../api/useCreateLessonPlan';
import { useUploadAttachment } from '../api/useUploadAttachment';

// UI Components
import { TextInput } from '../../../components/ui/TextInput';
import { SelectInput } from '../../../components/ui/SelectInput';
import { SectionCard } from '../../../components/ui/SectionCard';
import { FileUploader } from '../../../components/ui/FileUploader'; // <-- New Import

const FRAME_LABELS: Record<(typeof ACTIVITY_FRAMES)[number], string> = {
  plenary: 'מליאה',
  'small-group': 'קבוצה קטנה',
};

const DEFAULT_LESSON_PARTS_COUNT = 1;

const emptyLessonPart = (): CreateLessonPlanDto['lessonFlow'][number] => ({
  name: '',
  durationMinutes: 0,
  description: '',
});

export const CreateLessonPlanForm = () => {
  // State for files (Local state, not part of React Hook Form DTO)
  const [files, setFiles] = useState<File[]>([]);
  
  // API Mutations
  const createPlanMutation = useCreateLessonPlan();
  const uploadAttachmentMutation = useUploadAttachment();

  // Combined loading state
  const isSubmitting = createPlanMutation.isPending || uploadAttachmentMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CreateLessonPlanDto>({
    resolver: zodResolver(CreateLessonPlanSchema) as Resolver<CreateLessonPlanDto>,
    mode: 'onTouched',
    defaultValues: {
      topic: '',
      unit: '',
      ageGroup: AGE_GROUPS[0],
      frame: ACTIVITY_FRAMES[0],
      superGoal: '',
      operativeGoals: Array.from({ length: MIN_OPERATIVE_GOALS }, () => ''),
      priorKnowledge: '',
      teachingAids: [],
      references: [],
      lessonFlow: Array.from({ length: DEFAULT_LESSON_PARTS_COUNT }, emptyLessonPart),
    },
  });

  // --- Field Arrays Logic (Same as before) ---
  const { fields: lessonFlowFields, append: appendFlow, remove: removeFlow } = useFieldArray({ control, name: 'lessonFlow' });

  // Operative Goals
  const operativeGoalsValue = watch('operativeGoals');
  const operativeGoalsList = Array.isArray(operativeGoalsValue) ? operativeGoalsValue : Array.from({ length: MIN_OPERATIVE_GOALS }, () => '');
  const goalsCount = Math.max(operativeGoalsList.length, MIN_OPERATIVE_GOALS);
  const goalsIndices = Array.from({ length: goalsCount }, (_, i) => i);
  const appendGoal = () => setValue('operativeGoals', [...operativeGoalsList, '']);
  const removeGoal = (index: number) => {
    const next = operativeGoalsList.filter((_, i) => i !== index);
    setValue('operativeGoals', next.length < MIN_OPERATIVE_GOALS ? [...next, ''] : next);
  };

  // Teaching Aids & References
  const teachingAidsList = watch('teachingAids') || [];
  const appendTeachingAid = () => setValue('teachingAids', [...teachingAidsList, '']);
  const removeTeachingAid = (i: number) => setValue('teachingAids', teachingAidsList.filter((_, idx) => idx !== i));

  const referencesList = watch('references') || [];
  const appendReference = () => setValue('references', [...referencesList, '']);
  const removeReference = (i: number) => setValue('references', referencesList.filter((_, idx) => idx !== i));

  // --- THE SUBMIT LOGIC ---
  const onSubmit = async (data: CreateLessonPlanDto) => {
    try {
      // Step 1: Create the textual Lesson Plan
      const newPlan = await createPlanMutation.mutateAsync(data);
      
      // Step 2: If there are files, upload them one by one
      if (files.length > 0 && newPlan?.id) {
        await Promise.all(
          files.map((file) => 
            uploadAttachmentMutation.mutateAsync({ 
              lessonPlanId: newPlan.id, 
              file 
            })
          )
        );
      }

      // Step 3: Success! Reset form
      alert('המערך נוצר בהצלחה!'); // In a real app, use a Toast/Snackbar
      reset();
      setFiles([]);

    } catch (error) {
      console.error('Failed to submit lesson plan:', error);
      alert('אירעה שגיאה ביצירת המערך. נסה שנית.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto space-y-8 bg-neutral-50 p-8 rounded-xl shadow-sm border border-neutral-100"
      dir="rtl"
    >
      <header className="mb-6">
        <h2 className="text-3xl font-extrabold text-indigo-900">צור מערך שיעור חדש</h2>
        <p className="text-gray-500 mt-2">מלא את הפרטים הבאים כדי ליצור בסיס לשיעור שלך</p>
      </header>

      {/* --- Section 1: Basic Details --- */}
      <SectionCard title="פרטים בסיסיים" theme="indigo" icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextInput id="topic" label="נושא" placeholder="לדוגמה: מחזור המים" {...register('topic')} error={errors.topic} />
          <TextInput id="unit" label="יחידה" placeholder="לדוגמה: טבע וסביבה" {...register('unit')} error={errors.unit} />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SelectInput id="ageGroup" label="קבוצת גיל" options={AGE_GROUPS} {...register('ageGroup')} error={errors.ageGroup} />
          <SelectInput id="frame" label="מסגרת הוראה" options={ACTIVITY_FRAMES} getLabel={(val) => FRAME_LABELS[val as keyof typeof FRAME_LABELS] || val} {...register('frame')} error={errors.frame} />
        </div>
      </SectionCard>

      {/* --- Section 2: Goals --- */}
      <SectionCard title="מטרות" theme="orange" icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3 6 6 .5-4.5 3 1.5 6L12 15l-6 3 1.5-6L3 8.5 9 8 12 2z" /></svg>}>
        <TextInput id="superGoal" label="מטרת על" placeholder="מה המטרה הגדולה של השיעור?" {...register('superGoal')} error={errors.superGoal} />
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-800">מטרות אופרטיביות</label>
          {goalsIndices.map((index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1">
                <TextInput label="" placeholder={`מטרה ${index + 1}`} {...register(`operativeGoals.${index}`)} error={errors.operativeGoals?.[index]} className="mb-0" />
              </div>
              <button type="button" onClick={() => removeGoal(index)} disabled={goalsCount <= MIN_OPERATIVE_GOALS} className="mt-1 p-2 text-red-500 hover:bg-red-50 rounded disabled:opacity-30"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>
          ))}
          <button type="button" onClick={appendGoal} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>הוסף מטרה נוספת
          </button>
        </div>
      </SectionCard>

      {/* --- Section 3: Preparation --- */}
      <SectionCard title="הכנה לשיעור" theme="indigo" icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}>
        <div className="mb-6">
           <TextInput id="priorKnowledge" label="ידע קודם נדרש (אופציונלי)" placeholder="מה הילדים צריכים לדעת לפני השיעור?" {...register('priorKnowledge')} error={errors.priorKnowledge} />
        </div>
        
        {/* Teaching Aids List */}
        <div className="space-y-3 mb-6 border-t border-gray-100 pt-4">
           <label className="block text-sm font-semibold text-gray-800">אמצעי הוראה</label>
           {teachingAidsList.map((_, index) => (
             <div key={index} className="flex gap-3 items-start">
               <div className="flex-1"><TextInput label="" placeholder="לדוגמה: כרטיסיות" {...register(`teachingAids.${index}`)} className="mb-0" /></div>
               <button type="button" onClick={() => removeTeachingAid(index)} className="mt-1 p-2 text-red-500 hover:bg-red-50 rounded"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
             </div>
           ))}
           <button type="button" onClick={appendTeachingAid} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>הוסף אמצעי הוראה</button>
        </div>

        {/* References List */}
        <div className="space-y-3 border-t border-gray-100 pt-4">
           <label className="block text-sm font-semibold text-gray-800">מקורות מידע</label>
           {referencesList.map((_, index) => (
             <div key={index} className="flex gap-3 items-start">
               <div className="flex-1"><TextInput label="" placeholder="לדוגמה: קישור לסרטון" {...register(`references.${index}`)} className="mb-0" /></div>
               <button type="button" onClick={() => removeReference(index)} className="mt-1 p-2 text-red-500 hover:bg-red-50 rounded"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
             </div>
           ))}
           <button type="button" onClick={appendReference} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>הוסף מקור מידע</button>
        </div>
      </SectionCard>

      {/* --- Section 4: Attachments (NEW) --- */}
      <SectionCard title="קבצים נלווים" theme="indigo" icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>}>
         <FileUploader files={files} onFilesChange={setFiles} disabled={isSubmitting} />
      </SectionCard>

      {/* --- Section 5: Lesson Flow --- */}
      <SectionCard title="חלקי השיעור" theme="green" icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
        <div className="space-y-4">
          {lessonFlowFields.map((field, index) => (
            <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start bg-white p-4 rounded-md border border-gray-100 shadow-sm">
              <div className="flex-1 w-full"><TextInput label={index === 0 ? 'שם החלק' : ''} placeholder="פתיחה" {...register(`lessonFlow.${index}.name`)} error={errors.lessonFlow?.[index]?.name} /></div>
              <div className="w-full sm:w-24"><TextInput label={index === 0 ? 'דק׳' : ''} type="number" min={0} {...register(`lessonFlow.${index}.durationMinutes`, { valueAsNumber: true })} error={errors.lessonFlow?.[index]?.durationMinutes} /></div>
              <div className="flex-[2] w-full"><TextInput label={index === 0 ? 'תיאור הפעילות' : ''} placeholder="מה עושים?" {...register(`lessonFlow.${index}.description`)} error={errors.lessonFlow?.[index]?.description} /></div>
              <button type="button" onClick={() => removeFlow(index)} disabled={lessonFlowFields.length <= 1} className="mt-0 sm:mt-8 p-2 text-gray-400 hover:text-red-600 disabled:opacity-0"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>
          ))}
          <button type="button" onClick={() => appendFlow(emptyLessonPart())} className="w-full py-2 border-2 border-dashed border-indigo-200 rounded-md text-indigo-600 font-medium hover:bg-indigo-50 flex justify-center items-center gap-2"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>הוסף חלק חדש</button>
        </div>
      </SectionCard>

      {/* --- Footer Actions --- */}
      <footer className="flex justify-start pt-4">
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 bg-indigo-600 px-8 py-3 rounded-lg text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95">
          {isSubmitting ? (
            <><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>מעלה ומייצר מערך...</>
          ) : (
            <>שמור וצור מערך<svg className="h-5 w-5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>
          )}
        </button>
      </footer>
    </form>
  );
};