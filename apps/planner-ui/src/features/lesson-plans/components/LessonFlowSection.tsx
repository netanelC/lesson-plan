import { TextInput } from '../../../components/ui/TextInput';
import type { FieldError, UseFieldArrayAppend, UseFieldArrayRemove, UseFormRegister, UseFormWatch } from 'react-hook-form';
import type { CreateLessonPlanDto } from '@repo/types';

interface LessonFlowSectionProps {
  lessonFlowFields: Array<{ id: string }>;
  append: UseFieldArrayAppend<CreateLessonPlanDto, 'lessonFlow'>;
  remove: UseFieldArrayRemove;
  register: UseFormRegister<CreateLessonPlanDto>;
  watch: UseFormWatch<CreateLessonPlanDto>;
  errors: {
    lessonFlow?: (FieldError & { name?: FieldError; durationMinutes?: FieldError; description?: FieldError } | undefined)[];
  };
}

export const LessonFlowSection = ({
  lessonFlowFields,
  append,
  remove,
  register,
  errors,
}: LessonFlowSectionProps) => {
  const handleRemoveStep = (index: number) => {
    if (lessonFlowFields.length > 1) {
      remove(index);
    }
  };

  const handleAddStep = () => {
    append({ name: '', durationMinutes: 0, description: '' });
  };

  return (
    <div className="space-y-4">
      {lessonFlowFields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-col sm:flex-row gap-4 items-start bg-white p-4 rounded-md border border-gray-100 shadow-sm"
        >
          <div className="flex-1 w-full">
            <TextInput
              label={index === 0 ? 'שם החלק' : ''}
              {...register(`lessonFlow.${index}.name`)}
              error={errors.lessonFlow?.[index]?.name}
            />
          </div>
          <div className="w-full sm:w-24">
            <TextInput
              label={index === 0 ? 'דק׳' : ''}
              type="number"
              {...register(`lessonFlow.${index}.durationMinutes`, { valueAsNumber: true })}
              error={errors.lessonFlow?.[index]?.durationMinutes}
            />
          </div>
          <div className="flex-[2] w-full">
            <TextInput
              label={index === 0 ? 'תיאור הפעילות' : ''}
              {...register(`lessonFlow.${index}.description`)}
              error={errors.lessonFlow?.[index]?.description}
            />
          </div>
          <button
            type="button"
            onClick={() => handleRemoveStep(index)}
            disabled={lessonFlowFields.length <= 1}
            className={`mt-0 sm:mt-8 p-2 transition-colors ${
              lessonFlowFields.length <= 1
                ? 'text-gray-200 cursor-not-allowed'
                : 'text-gray-400 hover:text-red-600'
            }`}
            title={lessonFlowFields.length <= 1 ? 'At least one step required' : 'Remove step'}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddStep}
        className="w-full py-2 border-2 border-dashed border-indigo-200 rounded-md text-indigo-600 font-medium hover:bg-indigo-50 transition-all flex justify-center items-center gap-2"
      >
        + הוסף חלק חדש
      </button>
    </div>
  );
};
