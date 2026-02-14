import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/axios';
import type { LessonFilters, LessonPlan, PaginatedResponse } from '@repo/types';

export const useLessonPlans = (filters: LessonFilters) => {
  return useQuery<PaginatedResponse<LessonPlan>>({
    queryKey: ['lessons', filters], // Query key must include filters to trigger refetch
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<LessonPlan>>('/lessons', {
        params: filters, // Axios converts this object to ?search=...&page=...
      });
      return data;
    },
  });
};