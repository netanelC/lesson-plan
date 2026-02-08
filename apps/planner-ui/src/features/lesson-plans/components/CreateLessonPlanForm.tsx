import { useForm, useFieldArray, type Resolver } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateLessonPlanSchema,
  type CreateLessonPlanDto,
  AGE_GROUPS,
  ACTIVITY_FRAMES,
  MIN_OPERATIVE_GOALS,
} from '@repo/types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useCreateLessonPlan } from '../api/useCreateLessonPlan';

const FRAME_LABELS: Record<(typeof ACTIVITY_FRAMES)[number], string> = {
  plenary: 'מליאה',
  'small-group': 'קבוצה קטנה',
};

const DEFAULT_LESSON_PARTS_COUNT = 1;

const INPUT_CLASS =
  'block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';
const LABEL_CLASS = 'block text-sm font-medium text-gray-700 mb-1';
const ERROR_CLASS = 'mt-1 text-sm text-red-600';

const emptyLessonPart = (): CreateLessonPlanDto['lessonFlow'][number] => ({
  name: '',
  durationMinutes: undefined,
  description: '',
});

export const CreateLessonPlanForm = () => {
  const { mutate, isPending } = useCreateLessonPlan();

  const { register, control, handleSubmit, formState, watch, setValue } = useForm<CreateLessonPlanDto>({
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

  // In development: log validation errors to help debug missing messages
  useEffect(() => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('CreateLessonPlanForm errors:', formState.errors);
    }
  }, [formState.errors]);

  const { fields: lessonFlowFields, append: appendFlow, remove: removeFlow } = useFieldArray({
    control,
    name: 'lessonFlow',
  });

  const operativeGoalsValue = watch('operativeGoals');
  const operativeGoalsList: string[] = Array.isArray(operativeGoalsValue)
    ? operativeGoalsValue
    : Array.from({ length: MIN_OPERATIVE_GOALS }, () => '');
  const goalsCount = Math.max(operativeGoalsList.length, MIN_OPERATIVE_GOALS);
  const goalsIndices = Array.from({ length: goalsCount }, (_, i) => i);

  const appendGoal = () => {
    setValue('operativeGoals', [...operativeGoalsList, '']);
  };
  const removeGoal = (index: number) => {
    const next = operativeGoalsList.filter((_, i) => i !== index);
    setValue('operativeGoals', next.length >= MIN_OPERATIVE_GOALS ? next : operativeGoalsList);
  };

  const onSubmit = (data: CreateLessonPlanDto) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900">צור מערך שיעור חדש</h2>

      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-800">פרטים בסיסיים</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="topic" className={LABEL_CLASS}>
              נושא
            </label>
            <input
              id="topic"
              type="text"
              className={twMerge(clsx(INPUT_CLASS, formState.errors.topic && 'border-red-500'))}
              {...register('topic')}
            />
            {formState.errors.topic && (
              <p className={ERROR_CLASS}>{formState.errors.topic.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="unit" className={LABEL_CLASS}>
              יחידה
            </label>
            <input
              id="unit"
              type="text"
              className={twMerge(clsx(INPUT_CLASS, formState.errors.unit && 'border-red-500'))}
              {...register('unit')}
            />
            {formState.errors.unit && (
              <p className={ERROR_CLASS}>{formState.errors.unit.message}</p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="ageGroup" className={LABEL_CLASS}>
            קבוצת גיל
          </label>
          <select
            id="ageGroup"
            className={twMerge(clsx(INPUT_CLASS, formState.errors.ageGroup && 'border-red-500'))}
            {...register('ageGroup')}
          >
            {AGE_GROUPS.map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
          {formState.errors.ageGroup && (
            <p className={ERROR_CLASS}>{formState.errors.ageGroup.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="frame" className={LABEL_CLASS}>
            מסגרת הוראה
          </label>
          <select
            id="frame"
            className={twMerge(clsx(INPUT_CLASS, formState.errors.frame && 'border-red-500'))}
            {...register('frame')}
          >
            {ACTIVITY_FRAMES.map((frame) => (
              <option key={frame} value={frame}>
                {FRAME_LABELS[frame]}
              </option>
            ))}
          </select>
          {formState.errors.frame && (
            <p className={ERROR_CLASS}>{formState.errors.frame.message}</p>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-800">מטרות</h3>
        <div>
          <label htmlFor="superGoal" className={LABEL_CLASS}>
            מטרת על
          </label>
          <input
            id="superGoal"
            type="text"
            className={twMerge(clsx(INPUT_CLASS, formState.errors.superGoal && 'border-red-500'))}
            {...register('superGoal')}
          />
          {formState.errors.superGoal && (
            <p className={ERROR_CLASS}>{formState.errors.superGoal.message}</p>
          )}
        </div>
        <div>
          <label className={LABEL_CLASS}>מטרות אופרטיביות</label>
          {formState.errors.operativeGoals &&
            !Array.isArray(formState.errors.operativeGoals) &&
            formState.errors.operativeGoals.message && (
              <p className={ERROR_CLASS}>{formState.errors.operativeGoals.message}</p>
            )}
          <div className="space-y-4">
            {goalsIndices.map((index) => (
              <div
                key={index}
                className="flex gap-4 rounded border border-gray-100 bg-gray-50/50 p-4"
              >
                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    className={twMerge(
                      clsx(
                        INPUT_CLASS,
                        formState.errors.operativeGoals?.[index] && 'border-red-500'
                      )
                    )}
                    {...register(`operativeGoals.${index}`)}
                  />
                  {formState.errors.operativeGoals?.[index] && (
                    <p className={ERROR_CLASS}>
                      {formState.errors.operativeGoals[index]?.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeGoal(index)}
                  disabled={goalsCount <= MIN_OPERATIVE_GOALS}
                  className="shrink-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  הסר
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendGoal()}
              className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 hover:border-indigo-500 hover:text-indigo-600"
            >
              הוסף מטרה
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-800">חלקי השיעור</h3>
        <div className="space-y-4">
          {lessonFlowFields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-wrap items-end gap-4 rounded border border-gray-100 bg-gray-50/50 p-4"
            >
              <div className="min-w-[140px] flex-1">
                <label className={LABEL_CLASS}>שם</label>
                <input
                  type="text"
                  className={twMerge(
                    clsx(
                      INPUT_CLASS,
                      formState.errors.lessonFlow?.[index]?.name && 'border-red-500'
                    )
                  )}
                  {...register(`lessonFlow.${index}.name`)}
                />
                {formState.errors.lessonFlow?.[index]?.name && (
                  <p className={ERROR_CLASS}>
                    {formState.errors.lessonFlow[index]?.name?.message}
                  </p>
                )}
              </div>
              <div className="w-24">
                <label className={LABEL_CLASS}>משך (דק׳)</label>
                <input
                  type="number"
                  min={0}
                  className={twMerge(
                    clsx(
                      INPUT_CLASS,
                      formState.errors.lessonFlow?.[index]?.durationMinutes && 'border-red-500'
                    )
                  )}
                  {...register(`lessonFlow.${index}.durationMinutes`, {
                    valueAsNumber: true,
                  })}
                />
                {formState.errors.lessonFlow?.[index]?.durationMinutes && (
                  <p className={ERROR_CLASS}>
                    {formState.errors.lessonFlow[index]?.durationMinutes?.message}
                  </p>
                )}
              </div>
              <div className="min-w-[160px] flex-1">
                <label className={LABEL_CLASS}>תיאור</label>
                <input
                  type="text"
                  className={twMerge(
                    clsx(
                      INPUT_CLASS,
                      formState.errors.lessonFlow?.[index]?.description && 'border-red-500'
                    )
                  )}
                  {...register(`lessonFlow.${index}.description`)}
                />
                {formState.errors.lessonFlow?.[index]?.description && (
                  <p className={ERROR_CLASS}>
                    {formState.errors.lessonFlow[index]?.description?.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFlow(index)}
                disabled={lessonFlowFields.length <= 1}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                הסר
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendFlow(emptyLessonPart())}
            className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 hover:border-indigo-500 hover:text-indigo-600"
          >
            הוסף חלק
          </button>
        </div>
      </section>

      <footer className="flex justify-start">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <svg
                className="ml-2 h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              שולח...
            </>
          ) : (
            'שליחה'
          )}
        </button>
      </footer>
    </form>
  );
};
