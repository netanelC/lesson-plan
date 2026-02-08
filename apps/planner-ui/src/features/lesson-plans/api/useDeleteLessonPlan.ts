import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/axios';

export const useDeleteLessonPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/lesson-plans/${id}`);
    },
    onSuccess: () => {
      // Refresh the list automatically after delete
      queryClient.invalidateQueries({ queryKey: ['lesson-plans'] });
    },
  });
};