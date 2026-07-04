import { useNavigate } from "react-router-dom";
import type { CreateLessonPlanBody } from "@repo/types";
import { toast } from "react-hot-toast";
import { useCreateLessonPlan } from "../api/useCreateLessonPlan";
import { useUploadAttachment } from "../api/useUploadAttachment";
import { extractApiError } from "../../../lib/axios";
import { LessonPlanForm } from "./LessonPlanForm";

export const CreateLessonPlanForm = () => {
  const navigate = useNavigate();
  const createPlanMutation = useCreateLessonPlan();
  const uploadMutation = useUploadAttachment();

  const handleCreate = async (
    data: CreateLessonPlanBody,
    newFiles: File[] = [],
  ) => {
    try {
      const createdPlan = await createPlanMutation.mutateAsync(data);

      if (newFiles.length > 0) {
        await Promise.all(
          newFiles.map((file) =>
            uploadMutation.mutateAsync({
              lessonPlanId: createdPlan.id,
              file,
            }),
          ),
        );
      }

      toast.success("המערך נוצר בהצלחה!");
      // We'll navigate to the home page, but right now it's just a placeholder!
      void navigate("/");
    } catch (error) {
      toast.error(extractApiError(error));
    }
  };

  return (
    <LessonPlanForm
      onSubmit={handleCreate}
      isSubmitting={createPlanMutation.isPending || uploadMutation.isPending}
      title="צרי מערך שיעור חדש"
      submitLabel="שמרי וצרי מערך"
    />
  );
};
