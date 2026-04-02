import { useNavigate } from "react-router-dom";
import type { CreateLessonPlanBody } from "@repo/types";
import { useCreateLessonPlan } from "../api/useCreateLessonPlan";
import { LessonPlanForm } from "./LessonPlanForm";

export const CreateLessonPlanForm = () => {
  const navigate = useNavigate();
  const createPlanMutation = useCreateLessonPlan();

  const handleCreate = async (data: CreateLessonPlanBody) => {
    try {
      await createPlanMutation.mutateAsync(data);
      alert("המערך נוצר בהצלחה!");
      // We'll navigate to the home page, but right now it's just a placeholder!
      void navigate("/"); 
    } catch (error) {
      console.error("Failed to create lesson plan:", error);
      alert("אירעה שגיאה ביצירת המערך.");
    }
  };

  return (
    <LessonPlanForm
      onSubmit={handleCreate}
      isSubmitting={createPlanMutation.isPending}
      title="צרי מערך שיעור חדש"
      submitLabel="שמרי וצרי מערך"
    />
  );
};
