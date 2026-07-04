import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/axios";

export const useRemoveAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      await api.delete(`/lessons/attachments/${fileId}`);
    },
    onSuccess: () => {
      // Invalidate both lists and individual lesson queries to refresh attachments
      void queryClient.invalidateQueries({ queryKey: ["lessons"] });
      void queryClient.invalidateQueries({ queryKey: ["lesson"] });
    },
  });
};
