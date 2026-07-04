import { FastifyRequest, FastifyReply } from "fastify";
import { status } from "http-status";
import { Role } from "../db/prisma/generated/client";
import { usersService } from "./service";

export async function getAllUsersController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const users = await usersService.getAll();
  return reply.status(status.OK).send(users);
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
  const { id } = request.params;
  const { role } = request.body;

  const updated = await usersService.updateRole(id, role);
  return reply.status(status.OK).send(updated);
}
