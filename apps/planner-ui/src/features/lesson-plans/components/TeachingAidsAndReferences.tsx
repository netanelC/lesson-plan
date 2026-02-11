import { TextInput } from '../../../components/ui/TextInput';
import type { UseFormSetValue, UseFormWatch, UseFormRegister } from 'react-hook-form';
import type { CreateLessonPlanDto } from '@repo/types';

interface TeachingAidsAndReferencesProps {
  register: UseFormRegister<CreateLessonPlanDto>;
  watch: UseFormWatch<CreateLessonPlanDto>;
  setValue: UseFormSetValue<CreateLessonPlanDto>;
}

export const TeachingAidsAndReferences = ({
  register,
  watch,
  setValue,
}: TeachingAidsAndReferencesProps) => {
  const teachingAids = watch('teachingAids') || [];
  const references = watch('references') || [];

  const handleRemoveAid = (index: number) => {
    setValue('teachingAids', teachingAids.filter((_, i) => i !== index));
  };

  const handleAddAid = () => {
    setValue('teachingAids', [...teachingAids, '']);
  };

  const handleRemoveReference = (index: number) => {
    setValue('references', references.filter((_, i) => i !== index));
  };

  const handleAddReference = () => {
    setValue('references', [...references, '']);
  };

  return (
    <div className="space-y-6">
      {/* Teaching Aids */}
      <div className="space-y-3 border-b border-gray-100 pb-4">
        <label className="block text-sm font-semibold text-gray-800">אמצעי הוראה</label>
        {teachingAids.map((_, i) => (
          <div key={i} className="flex gap-2">
            <div className="flex-1">
              <TextInput label="" placeholder="לדוגמה: מיקרוסקופ, תמונות, וידאו" {...register(`teachingAids.${i}`)} />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveAid(i)}
              className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Remove teaching aid"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAid}
          className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:text-indigo-800 transition-colors"
        >
          + הוסף אמצעי הוראה
        </button>
      </div>

      {/* References */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">מקורות מידע</label>
        {references.map((_, i) => (
          <div key={i} className="flex gap-2">
            <div className="flex-1">
              <TextInput label="" placeholder="לדוגמה: ספר - 'החי והצומח' בעמ׳ 45-50" {...register(`references.${i}`)} />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveReference(i)}
              className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Remove reference"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddReference}
          className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:text-indigo-800 transition-colors"
        >
          + הוסף מקור מידע
        </button>
      </div>
    </div>
  );
};
