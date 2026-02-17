import { FastifyRequest, FastifyReply } from "fastify";
import { status } from "http-status";
import { createLessonPlanInDB } from "./DAL";

export async function createLessonPlanController(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  request: FastifyRequest<{ Body: { topic: string } }>,
  reply: FastifyReply
): Promise<FastifyReply> {
  try {
    const { topic } = request.body;
    
    const newLessonPlan = await createLessonPlanInDB({ topic });
    
    return await reply.status(status.CREATED).send({
      message: "Lesson plan created successfully",
      data: newLessonPlan,
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(status.INTERNAL_SERVER_ERROR).send({ error: "Internal Server Error" });
  }
}
