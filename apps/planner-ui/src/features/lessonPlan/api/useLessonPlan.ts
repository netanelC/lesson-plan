import { useQuery } from "@tanstack/react-query";
import type { LessonPlan, Attachment } from "@repo/types";
import { api } from "../../../lib/axios";

// Update this interface to match your Backend & Prisma Schema exactly
export type LessonPlanWithAttachments = LessonPlan & {
  attachments: Attachment[];
  author: { fullName: string };
  savedBy?: { userId: string }[];
};

export const useLessonPlan = (id: string) => {
  return useQuery({
    queryKey: ["lessons", id],
    queryFn: async () => {
      const { data } = await api.get<{
        success: boolean;
        data: LessonPlanWithAttachments;
      }>(`/lessons/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};
