import { useNavigate } from "react-router-dom";
import type { CreateLessonPlanDto } from "@repo/types";
import { useCreateLessonPlan } from "../api/useCreateLessonPlan";
import { useUploadAttachment } from "../api/useUploadAttachment";
import { LessonPlanForm } from "./LessonPlanForm";

export const CreateLessonPlanForm = () => {
  const navigate = useNavigate();
  const createPlanMutation = useCreateLessonPlan();
  const uploadAttachmentMutation = useUploadAttachment();

  const handleCreate = async (data: CreateLessonPlanDto, files: File[]) => {
    try {
      // Step 1: Create the textual Lesson Plan
      const newPlan = await createPlanMutation.mutateAsync(data);

      // Step 2: Upload files if they exist
      if (files.length > 0 && newPlan?.id) {
        await Promise.all(
          files.map((file) =>
            uploadAttachmentMutation.mutateAsync({
              lessonPlanId: newPlan.id,
              file,
            }),
          ),
        );
      }

      alert("המערך נוצר בהצלחה!");
      navigate("/"); // Redirect to dashboard
    } catch (error) {
      console.error("Failed to create lesson plan:", error);
      alert("אירעה שגיאה ביצירת המערך.");
    }
  };

  return (
    <LessonPlanForm
      onSubmit={handleCreate}
      isSubmitting={
        createPlanMutation.isPending || uploadAttachmentMutation.isPending
      }
      title="צרי מערך שיעור חדש"
      submitLabel="שמרי וצרי מערך"
    />
  );
};
