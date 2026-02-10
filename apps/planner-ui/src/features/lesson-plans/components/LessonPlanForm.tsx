import { useState, useEffect } from 'react';
import { useForm, useFieldArray, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateLessonPlanSchema,
  type CreateLessonPlanDto,
  AGE_GROUPS,
  ACTIVITY_FRAMES,
  MIN_OPERATIVE_GOALS,
  type LessonPlan,
  type Attachment,
} from '@repo/types';

// Hooks
import { useRemoveAttachment } from '../api/useRemoveAttachment';

// UI Components
import { TextInput } from '../../../components/ui/TextInput';
import { SelectInput } from '../../../components/ui/SelectInput';
import { SectionCard } from '../../../components/ui/SectionCard';
import { FileUploader } from '../../../components/ui/FileUploader';

const FRAME_LABELS: Record<string, string> = {
  plenary: 'מליאה',
  'small-group': 'קבוצה קטנה',
};

interface Props {
  initialData?: LessonPlan;
  onSubmit: (data: CreateLessonPlanDto, newFiles: File[]) => Promise<void>;
  isSubmitting: boolean;
  title: string;
  submitLabel: string;
}

export const LessonPlanForm = ({ initialData, onSubmit, isSubmitting, title, submitLabel }: Props) => {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  // Local state for immediate UI updates when deleting existing attachments
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([]);
  
  const removeAttachmentMutation = useRemoveAttachment();

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
      operativeGoals: Array(MIN_OPERATIVE_GOALS).fill(''),
      priorKnowledge: '',
      teachingAids: [],
      references: [],
      lessonFlow: [{ name: '', durationMinutes: 0, description: '' }],
    },
  });

  // Pre-fill form and local attachment state when editing
  useEffect(() => {
    if (initialData) {
      reset({
        topic: initialData.topic,
        unit: initialData.unit,
        ageGroup: initialData.ageGroup,
        frame: initialData.frame,
        superGoal: initialData.superGoal,
        priorKnowledge: initialData.priorKnowledge || '',
        operativeGoals: initialData.operativeGoals,
        teachingAids: initialData.teachingAids || [],
        references: initialData.references || [],
        lessonFlow: initialData.lessonFlow,
      });
      setExistingAttachments(initialData.attachments || []);
    }
  }, [initialData, reset]);

  // Dynamic Logic for Lesson Flow
  const { fields: lessonFlowFields, append: appendFlow, remove: removeFlow } = useFieldArray({ control, name: 'lessonFlow' });
  
  // Watchers for dynamic lists
  const operativeGoals = watch('operativeGoals') || [];
  const teachingAids = watch('teachingAids') || [];
  const references = watch('references') || [];

  const handleDeleteExistingFile = async (fileId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק קובץ זה לצמיתות?')) {
      try {
        await removeAttachmentMutation.mutateAsync(fileId);
        // Immediately update local state so the file disappears from the UI
        setExistingAttachments((prev) => prev.filter((file) => file.id !== fileId));
      } catch (error) {
        alert('שגיאה במחיקת הקובץ');
        console.error('Failed to delete attachment:', error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, newFiles))}
      className="max-w-3xl mx-auto space-y-8 bg-neutral-50 p-8 rounded-xl shadow-sm border border-neutral-100"
      dir="rtl"
    >
      <header className="mb-6">
        <h2 className="text-3xl font-extrabold text-indigo-900">{title}</h2>
      </header>

      {/* --- Section 1: Basic Details --- */}
      <SectionCard 
        title="פרטים בסיסיים" 
        theme="indigo" 
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextInput id="topic" label="נושא" {...register('topic')} error={errors.topic} />
          <TextInput id="unit" label="יחידה" {...register('unit')} error={errors.unit} />
          <SelectInput id="ageGroup" label="קבוצת גיל" options={AGE_GROUPS} {...register('ageGroup')} error={errors.ageGroup} />
          <SelectInput 
             id="frame" 
             label="מסגרת הוראה" 
             options={ACTIVITY_FRAMES} 
             getLabel={(val) => FRAME_LABELS[val] || val} 
             {...register('frame')} 
             error={errors.frame} 
          />
        </div>
      </SectionCard>

      {/* --- Section 2: Goals --- */}
      <SectionCard 
        title="מטרות" 
        theme="orange"
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3 6 6 .5-4.5 3 1.5 6L12 15l-6 3 1.5-6L3 8.5 9 8 12 2z" /></svg>}
      >
        <TextInput id="superGoal" label="מטרת על" {...register('superGoal')} error={errors.superGoal} />
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-800">מטרות אופרטיביות</label>
          {operativeGoals.map((_, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-1">
                <TextInput label="" {...register(`operativeGoals.${index}`)} error={errors.operativeGoals?.[index]} />
              </div>
              <button 
                type="button" 
                onClick={() => setValue('operativeGoals', operativeGoals.filter((_, i) => i !== index))}
                disabled={operativeGoals.length <= MIN_OPERATIVE_GOALS}
                className={`mt-1 p-2 rounded transition-colors ${
                  operativeGoals.length <= MIN_OPERATIVE_GOALS 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-red-500 hover:bg-red-50'
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setValue('operativeGoals', [...operativeGoals, ''])} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            הוסף מטרה נוספת
          </button>
        </div>
      </SectionCard>

      {/* --- Section 3: Preparation --- */}
      <SectionCard 
        title="הכנה לשיעור" 
        theme="indigo"
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
      >
        <TextInput id="priorKnowledge" label="ידע קודם נדרש (אופציונלי)" {...register('priorKnowledge')} />
        
        {/* Teaching Aids */}
        <div className="mt-6 space-y-3 border-t border-gray-100 pt-4">
          <label className="block text-sm font-semibold text-gray-800">אמצעי הוראה</label>
          {teachingAids.map((_, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex-1"><TextInput label="" {...register(`teachingAids.${i}`)} /></div>
              <button type="button" onClick={() => setValue('teachingAids', teachingAids.filter((_, idx) => idx !== i))} className="p-2 text-red-500 hover:bg-red-50 rounded">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => setValue('teachingAids', [...teachingAids, ''])} className="text-indigo-600 text-sm font-bold flex items-center gap-1">+ הוסף אמצעי הוראה</button>
        </div>

        {/* References */}
        <div className="mt-6 space-y-3 border-t border-gray-100 pt-4">
          <label className="block text-sm font-semibold text-gray-800">מקורות מידע</label>
          {references.map((_, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex-1"><TextInput label="" {...register(`references.${i}`)} /></div>
              <button type="button" onClick={() => setValue('references', references.filter((_, idx) => idx !== i))} className="p-2 text-red-500 hover:bg-red-50 rounded">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => setValue('references', [...references, ''])} className="text-indigo-600 text-sm font-bold flex items-center gap-1">+ הוסף מקור מידע</button>
        </div>
      </SectionCard>

      {/* --- Section 4: Attachments --- */}
      <SectionCard 
        title="קבצים נלווים" 
        theme="indigo"
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>}
      >
         {existingAttachments.length > 0 && (
           <div className="mb-4 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
             <p className="text-sm font-bold text-indigo-900 mb-3">קבצים קיימים במערך:</p>
             <ul className="space-y-2">
               {existingAttachments.map((file) => (
                 <li key={file.id} className="text-sm bg-white p-2 rounded border border-indigo-100 flex items-center justify-between shadow-sm transition-all animate-in fade-in slide-in-from-right-2">
                   <div className="flex items-center gap-2 text-indigo-700">
                     <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                     <span className="truncate max-w-[200px]">{file.filename}</span>
                   </div>
                   <button
                    type="button"
                    onClick={() => handleDeleteExistingFile(file.id)}
                    disabled={removeAttachmentMutation.isPending}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                   >
                     {removeAttachmentMutation.isPending ? (
                       <div className="h-4 w-4 animate-spin border-2 border-red-500 border-t-transparent rounded-full" />
                     ) : (
                       <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     )}
                   </button>
                 </li>
               ))}
             </ul>
           </div>
         )}
         <FileUploader files={newFiles} onFilesChange={setNewFiles} disabled={isSubmitting} />
      </SectionCard>

      {/* --- Section 5: Lesson Flow --- */}
      <SectionCard 
        title="חלקי השיעור" 
        theme="green"
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      >
        <div className="space-y-4">
          {lessonFlowFields.map((field, index) => (
            <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start bg-white p-4 rounded-md border border-gray-100 shadow-sm">
              <div className="flex-1 w-full"><TextInput label={index === 0 ? 'שם החלק' : ''} {...register(`lessonFlow.${index}.name`)} error={errors.lessonFlow?.[index]?.name} /></div>
              <div className="w-full sm:w-24"><TextInput label={index === 0 ? 'דק׳' : ''} type="number" {...register(`lessonFlow.${index}.durationMinutes`, { valueAsNumber: true })} error={errors.lessonFlow?.[index]?.durationMinutes} /></div>
              <div className="flex-[2] w-full"><TextInput label={index === 0 ? 'תיאור הפעילות' : ''} {...register(`lessonFlow.${index}.description`)} error={errors.lessonFlow?.[index]?.description} /></div>
              <button type="button" onClick={() => removeFlow(index)} disabled={lessonFlowFields.length <= 1} className="mt-0 sm:mt-8 p-2 text-gray-400 hover:text-red-600 transition-colors">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => appendFlow({ name: '', durationMinutes: 0, description: '' })} className="w-full py-2 border-2 border-dashed border-indigo-200 rounded-md text-indigo-600 font-medium hover:bg-indigo-50 transition-all flex justify-center items-center gap-2">
            + הוסף חלק חדש
          </button>
        </div>
      </SectionCard>

      <footer className="flex justify-start pt-4">
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-10 py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
        >
          {isSubmitting ? (
            <><div className="h-5 w-5 animate-spin border-2 border-white border-t-transparent rounded-full" /> מעבד...</>
          ) : (
            submitLabel
          )}
        </button>
      </footer>
    </form>
  );
};