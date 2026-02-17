import { FastifyRequest, FastifyReply } from "fastify";
import { status } from "http-status";
import { CreateLessonPlanBody } from "@repo/types";
import { createLessonPlanInDB } from "./DAL";

type CreateLessonPlanRequest = FastifyRequest<{
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Body: CreateLessonPlanBody;
}>;

export async function createLessonPlanController(
  request: CreateLessonPlanRequest,
  reply: FastifyReply
): Promise<FastifyReply> {
  try {
    const newLessonPlan = await createLessonPlanInDB(request.body);
    
    return await reply.status(status.CREATED).send({
      success: true,
      data: newLessonPlan,
    });
  } catch (error) {
    request.log.error({ err: error }, "Failed to create lesson plan");
    
    return reply.status(status.INTERNAL_SERVER_ERROR).send({ 
      success: false, 
      error: "Internal Server Error" 
    });
  }
}
