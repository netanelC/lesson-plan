import { useMutation } from "@tanstack/react-query";
import { api } from "../../../lib/axios";

export const useUploadAttachment = () => {
  return useMutation({
    mutationFn: async ({
      lessonPlanId,
      file,
    }: {
      lessonPlanId: string;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append("file", file);

      // שליחת הקובץ ל-Endpoint שיצרנו ב-Backend
      const { data } = await api.post(
        `/lessons/${lessonPlanId}/attachments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
  });
};
