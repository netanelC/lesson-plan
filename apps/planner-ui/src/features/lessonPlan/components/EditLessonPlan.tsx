import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { CreateLessonPlanBody, CreateLessonPlanInput } from "@repo/types";
import { toast } from "react-hot-toast";
import { useLessonPlan } from "../api/useLessonPlan";
import { useUpdateLessonPlan } from "../api/useUpdateLessonPlan";
import { useUploadAttachment } from "../api/useUploadAttachment";
import { useRemoveAttachment } from "../api/useRemoveAttachment";
import { extractApiError } from "../../../lib/axios";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { LessonPlanForm } from "./LessonPlanForm";

export const EditLessonPlan = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [attachmentToDelete, setAttachmentToDelete] = useState<string | null>(null);

  // 1. Fetch existing data (Ensure ID exists)
  const { data: plan, isLoading, isError } = useLessonPlan(id ?? "");

  // 2. Mutations for Updating
  const updateMutation = useUpdateLessonPlan(id ?? "");
  const uploadMutation = useUploadAttachment();
  const removeAttachmentMutation = useRemoveAttachment();

  const handleUpdate = async (
    data: CreateLessonPlanBody,
    newFiles: File[] = [],
  ) => {
    try {
      // Step 1: Update the textual content via the PUT route
      await updateMutation.mutateAsync(data);

      // Step 2: If the user added new files during the edit, upload them
      if (newFiles.length > 0 && id != null) {
        await Promise.all(
          newFiles.map((file) =>
            uploadMutation.mutateAsync({
              lessonPlanId: id,
              file,
            }),
          ),
        );
      }
      toast.success("המערך עודכן בהצלחה!");
      void navigate(`/plan/${id}`); // Navigate back to the details view
    } catch (error) {
      toast.error(extractApiError(error));
    }
  };

  const handleRemoveExistingAttachment = (attachmentId: string) => {
    setAttachmentToDelete(attachmentId);
  };

  const confirmRemoveAttachment = async () => {
    if (attachmentToDelete === null) return;
    try {
      await removeAttachmentMutation.mutateAsync(attachmentToDelete);
      toast.success("הקובץ נמחק בהצלחה!");
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setAttachmentToDelete(null);
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
    <>
      <LessonPlanForm
        initialData={{
          ...plan,
          lessonFlow: plan.lessonFlow as CreateLessonPlanInput["lessonFlow"],
          teachingAids:
            plan.teachingAids as CreateLessonPlanInput["teachingAids"],
          references: plan.references as CreateLessonPlanInput["references"],
        }}
        existingAttachments={plan.attachments}
        onRemoveExistingAttachment={handleRemoveExistingAttachment}
        onSubmit={handleUpdate}
        isSubmitting={
          updateMutation.isPending ||
          uploadMutation.isPending ||
          removeAttachmentMutation.isPending
        }
        title="עריכת מערך שיעור"
        submitLabel="שמור שינויים"
      />
      <ConfirmModal
        isOpen={attachmentToDelete !== null}
        onClose={() => setAttachmentToDelete(null)}
        onConfirm={confirmRemoveAttachment}
        title="מחיקת קובץ"
        message="האם למחוק קובץ זה? (פעולה זו לא ניתנת לביטול)"
        confirmText="מחק קובץ"
        isDestructive={true}
      />
    </>
  );
};
