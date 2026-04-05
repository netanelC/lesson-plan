import { FastifyRequest, FastifyReply } from "fastify";
import { status } from "http-status";
import { Role } from "../db/prisma/generated/client";
import { getAllUsers, updateUserRole } from "./DAL";

export async function getAllUsersController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const users = await getAllUsers();

    return await reply.status(status.OK).send(users);
  } catch (error) {
    request.log.error({ err: error }, "Failed to get users");

    return reply.status(status.INTERNAL_SERVER_ERROR).send({
      success: false,
      error: "Internal Server Error",
    });
  }
}

export async function updateUserRoleController(
  request: FastifyRequest<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Params: { id: string };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Body: { role: Role };
  }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const { id } = request.params;
    const { role } = request.body;

    const updated = await updateUserRole(id, role);

    return await reply.status(status.OK).send(updated);
  } catch (error) {
    request.log.error({ err: error }, "Failed to update user role");

    return reply.status(status.INTERNAL_SERVER_ERROR).send({
      success: false,
      error: "Internal Server Error",
    });
  }
}
