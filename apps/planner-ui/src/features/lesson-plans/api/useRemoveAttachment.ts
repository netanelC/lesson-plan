import { useMutation } from "@tanstack/react-query";

export const useRemoveAttachment = () => {
  return useMutation({
    mutationFn: async (fileId: string) => {
      const response = await fetch(`/api/lessons/attachments/${fileId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete file');
    },
  });
};