import { useMutation } from "@tanstack/react-query";
import { api } from "../../../lib/axios";

export const useRemoveAttachment = () => {
  return useMutation({
    mutationFn: async (fileId: string) => {
      await api.delete(`/lessons/attachments/${fileId}`);
    },
  });
};
