import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateLessonPlanBody } from "@repo/types";
import { api } from "../../../lib/axios";

export const useUpdateLessonPlan = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLessonPlanBody) => {
      const { data: result } = await api.put(`/lessons/${id}`, data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["lessons", id] });
    },
  });
};
