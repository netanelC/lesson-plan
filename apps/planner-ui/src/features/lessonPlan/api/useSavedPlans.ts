import { useQuery } from "@tanstack/react-query";
import { type LessonFilters, type PaginatedResponse } from "@repo/types";
import { api } from "../../../lib/axios";

import { type ExtendedLessonPlan } from "./useLessonPlans";

export const useSavedPlans = (filters: LessonFilters) => {
  return useQuery({
    queryKey: ["saved-plans", filters],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<ExtendedLessonPlan>>(
        "/lessons/saved",
        {
          params: filters,
        },
      );
      return response.data;
    },
  });
};
