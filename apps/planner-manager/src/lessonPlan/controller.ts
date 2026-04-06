import { FastifyRequest, FastifyReply } from "fastify";
import { status } from "http-status";
import { CreateLessonPlanBody, LessonFilters } from "@repo/types";
import { createLessonPlan, getAll } from "./DAL";

type CreateLessonPlanRequest = FastifyRequest<{
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Body: CreateLessonPlanBody;
}>;

export async function createLessonPlanController(
  request: CreateLessonPlanRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const newLessonPlan = await createLessonPlan({
      ...request.body,
      authorId: request.user.id,
    });

    return await reply.status(status.CREATED).send({
      success: true,
      data: newLessonPlan,
    });
  } catch (error) {
    request.log.error({ err: error }, "Failed to create lesson plan");

    return reply.status(status.INTERNAL_SERVER_ERROR).send({
      success: false,
      error: "Internal Server Error",
    });
  }
}

export async function getLessonPlansController(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  request: FastifyRequest<{ Querystring: LessonFilters }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const { page, limit } = request.query;
    const skip = (page - 1) * limit;

    const [total, rawLessonPlans] = await getAll(request.query, skip, limit);

    // TEMPORARY MOCK: Inject fake author details until we build the User relation
    const lessonPlans = rawLessonPlans.map((plan) => ({
      ...plan,
      author: { fullName: "נתנאל" },
    }));

    const totalPages = Math.ceil(total / limit);

    return await reply.status(status.OK).send({
      data: lessonPlans,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    request.log.error(error);
    return reply
      .status(status.INTERNAL_SERVER_ERROR)
      .send({ success: false, error: "Internal Server Error" });
  }
}
