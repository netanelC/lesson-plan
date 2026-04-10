import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateLessonPlanBody, LessonPlan } from "@repo/types";
import { api } from "../../../lib/axios";

const LESSON_PLANS_QUERY_KEY = ["lessons"] as const;

// 1. Define the exact shape our Fastify backend returns
interface CreateLessonResponse {
  success: boolean;
  data: LessonPlan;
}

export function useCreateLessonPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLessonPlanBody) => {
      // 2. Pass the interface to Axios so 'response' is strongly typed
      const { data: response } = await api.post<CreateLessonResponse>(
        "/lessons",
        data,
      );

      // Now TypeScript knows that response.data is exactly a LessonPlan object
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LESSON_PLANS_QUERY_KEY });
    },
  });
}
