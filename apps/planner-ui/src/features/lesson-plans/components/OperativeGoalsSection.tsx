import type { ReactNode } from 'react';
import { TextInput } from '../../../components/ui/TextInput';
import { MIN_OPERATIVE_GOALS } from '@repo/types';
import type { FieldError, UseFormSetValue, UseFormWatch, UseFormRegister } from 'react-hook-form';
import type { CreateLessonPlanDto } from '@repo/types';

interface OperativeGoalsSectionProps {
  operativeGoals: string[];
  register: UseFormRegister<CreateLessonPlanDto>;
  watch: UseFormWatch<CreateLessonPlanDto>;
  setValue: UseFormSetValue<CreateLessonPlanDto>;
  errors: {
    superGoal?: FieldError;
    operativeGoals?: (FieldError | undefined)[];
  };
  icon?: ReactNode;
}

export const OperativeGoalsSection = ({
  operativeGoals,
  register,
  watch,
  setValue,
  errors,
  icon,
}: OperativeGoalsSectionProps) => {
  const goals = watch('operativeGoals') || operativeGoals;

  const handleRemoveGoal = (index: number) => {
    setValue('operativeGoals', goals.filter((_, i) => i !== index));
  };

  const handleAddGoal = () => {
    setValue('operativeGoals', [...goals, '']);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon && <div className="text-orange-600">{icon}</div>}
        <label className="block text-sm font-semibold text-gray-800">מטרות אופרטיביות</label>
      </div>

      <div>
        <TextInput id="superGoal" label="מטרת על" placeholder="לדוגמה: התלמידים יבינו את חשיבות ההגנה על הטבע" {...register('superGoal')} error={errors.superGoal} />
      </div>

      <div className="space-y-3">
        {goals.map((_, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-1">
              <TextInput
                label=""
                placeholder="לדוגמה: התלמיד יוכל לזהות סוגי צמחים"
                {...register(`operativeGoals.${index}`)}
                error={errors.operativeGoals?.[index]}
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveGoal(index)}
              disabled={goals.length <= MIN_OPERATIVE_GOALS}
              className={`mt-1 p-2 rounded transition-colors ${
                goals.length <= MIN_OPERATIVE_GOALS
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-red-500 hover:bg-red-50'
              }`}
              title={goals.length <= MIN_OPERATIVE_GOALS ? `Minimum ${MIN_OPERATIVE_GOALS} goals required` : 'Remove goal'}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddGoal}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          הוסף מטרה נוספת
        </button>
      </div>
    </div>
  );
};
