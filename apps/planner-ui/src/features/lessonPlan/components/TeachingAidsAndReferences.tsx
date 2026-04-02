import type { UseFormSetValue, UseFormWatch, UseFormRegister } from "react-hook-form";
import type { CreateLessonPlanInput } from "@repo/types";
import { TextInput } from "../../../components/ui/TextInput";

interface TeachingAidsAndReferencesProps {
  register: UseFormRegister<CreateLessonPlanInput>;
  watch: UseFormWatch<CreateLessonPlanInput>;
  setValue: UseFormSetValue<CreateLessonPlanInput>;
}

export const TeachingAidsAndReferences = ({
  register,
  watch,
  setValue,
}: TeachingAidsAndReferencesProps) => {
  // We watch these so the UI re-renders when we add/remove items
  const teachingAids = watch("teachingAids") ?? [];
  const references = watch("references") ?? [];

  const handleAddAid = () => setValue("teachingAids", [...teachingAids, ""]);
  const handleRemoveAid = (index: number) => 
    setValue("teachingAids", teachingAids.filter((_, i) => i !== index));

  const handleAddReference = () => setValue("references", [...references, ""]);
  const handleRemoveReference = (index: number) => 
    setValue("references", references.filter((_, i) => i !== index));

  return (
    <div className="space-y-6">
      {/* --- Teaching Aids Section --- */}
      <div className="space-y-3 border-b border-gray-100 pb-4">
        <label className="block text-sm font-semibold text-gray-800">אמצעי הוראה</label>
        {teachingAids.map((_, i) => (
          <div key={`aid-${i}`} className="flex gap-2">
            <div className="flex-1">
              <TextInput
                label=""
                placeholder="לדוגמה: מיקרוסקופ, תמונות"
                {...register(`teachingAids.${i}` as const)}
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveAid(i)}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAid}
          className="text-indigo-600 text-sm font-bold flex items-center gap-1"
        >
          + הוסיפי אמצעי הוראה
        </button>
      </div>

      {/* --- References Section --- */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">מקורות מידע</label>
        {references.map((_, i) => (
          <div key={`ref-${i}`} className="flex gap-2">
            <div className="flex-1">
              <TextInput
                label=""
                placeholder="לדוגמה: ספר 'החי והצומח' עמ' 45"
                {...register(`references.${i}` as const)}
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveReference(i)}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddReference}
          className="text-indigo-600 text-sm font-bold flex items-center gap-1"
        >
          + הוסיפי מקור מידע
        </button>
      </div>
    </div>
  );
};
