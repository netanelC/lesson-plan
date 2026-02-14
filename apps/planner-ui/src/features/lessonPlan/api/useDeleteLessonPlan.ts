import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/axios";

export const useDeleteLessonPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/lessons/${id}`);
    },
    onSuccess: () => {
      // Refresh the list automatically after delete
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
};
