import { useParams, useNavigate } from "react-router-dom";
import type { CreateLessonPlanDto } from "@repo/types";
import { useLessonPlan } from "../api/useLessonPlan";
import { useUpdateLessonPlan } from "../api/useUpdateLessonPlan";
import { useUploadAttachment } from "../api/useUploadAttachment";
import { LessonPlanForm } from "./LessonPlanForm";

export const EditLessonPlan = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 1. Fetch existing data (Ensure ID exists)
  const { data: plan, isLoading, isError } = useLessonPlan(id || "");

  // 2. Mutations for Updating
  const updateMutation = useUpdateLessonPlan(id || "");
  const uploadMutation = useUploadAttachment();

  const handleUpdate = async (data: CreateLessonPlanDto, newFiles: File[]) => {
    try {
      // Step 1: Update the textual content via the PUT route
      await updateMutation.mutateAsync(data);

      // Step 2: If the user added new files during the edit, upload them
      if (newFiles.length > 0 && id) {
        await Promise.all(
          newFiles.map((file) =>
            uploadMutation.mutateAsync({
              lessonPlanId: id,
              file,
            }),
          ),
        );
      }

      alert("המערך עודכן בהצלחה!");
      navigate(`/plan/${id}`); // Navigate back to the details view
    } catch (error) {
      console.error("Update failed:", error);
      alert("אירעה שגיאה בעדכון המערך. נסה שנית.");
    }
  };

  // Loading state with your existing spinner style
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Error state
  if (isError || !plan) {
    return (
      <div
        className="text-center p-10 bg-red-50 text-red-600 rounded-lg"
        dir="rtl"
      >
        שגיאה בטעינת המערך לעריכה. וודא שהשרת רץ.
      </div>
    );
  }

  return (
    <LessonPlanForm
      initialData={plan}
      onSubmit={handleUpdate}
      isSubmitting={updateMutation.isPending || uploadMutation.isPending}
      title="עריכת מערך שיעור"
      submitLabel="שמור שינויים"
    />
  );
};
