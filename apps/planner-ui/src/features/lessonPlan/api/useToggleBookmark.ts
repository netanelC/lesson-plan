import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/axios";

interface ToggleBookmarkResponse {
  success: boolean;
  data: {
    saved: boolean;
  };
}

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<ToggleBookmarkResponse>(
        `/lessons/${id}/save`,
      );
      return response.data;
    },
    onSettled: async () => {
      // Invalidate both lesson-plans and saved-plans queries to keep data fresh
      await queryClient.invalidateQueries({ queryKey: ["lesson-plans"] });
      await queryClient.invalidateQueries({ queryKey: ["saved-plans"] });
    },
  });
};
