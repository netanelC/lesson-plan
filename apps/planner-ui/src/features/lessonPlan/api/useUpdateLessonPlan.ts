import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateLessonPlanBody, LessonPlan } from "@repo/types";
import { api } from "../../../lib/axios";

export const useUpdateLessonPlan = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLessonPlanBody) => {
      const result = await api.put<{ data: LessonPlan }>(`/lessons/${id}`, data);
      return result.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["lessons"] });
      void queryClient.invalidateQueries({ queryKey: ["lessons", id] });
    },
  });
};
