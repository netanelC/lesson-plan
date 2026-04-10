import { useQuery } from "@tanstack/react-query";
import type { LessonPlan } from "@repo/types";
import { api } from "../../../lib/axios";

// Update this interface to match your Backend & Prisma Schema exactly
export interface LessonPlanWithAttachments extends LessonPlan {
  attachments: {
    id: string;
    filename: string; // Changed from fileName
    url: string; // Changed from fileUrl
    fileType: string; // Changed from mimeType
    sizeBytes: number;
  }[];
}

export const useLessonPlan = (id: string) => {
  return useQuery({
    queryKey: ["lessons", id],
    queryFn: async () => {
      // The backend returns the plan with the "attachments" array inside it
      const { data } = await api.get<LessonPlanWithAttachments>(
        `/lessons/${id}`,
      );
      return data;
    },
    enabled: !!id,
  });
};
