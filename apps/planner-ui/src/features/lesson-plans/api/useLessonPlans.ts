import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/axios';
import type { LessonPlan } from '@repo/types';

export const useLessonPlans = () => {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const { data } = await api.get<LessonPlan[]>('/lessons');
      return data;
    },
  });
};