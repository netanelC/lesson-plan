import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateLessonPlanDto } from "@repo/types";
import { api } from "../../../lib/axios";

const LESSON_PLANS_QUERY_KEY = ["lessons"] as const;

export function useCreateLessonPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLessonPlanDto) => {
      const { data: result } = await api.post("/lessons", data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LESSON_PLANS_QUERY_KEY });
    },
  });
}
