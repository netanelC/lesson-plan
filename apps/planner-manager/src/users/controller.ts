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

export async function updateUserStatusController(
  request: FastifyRequest<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Params: { id: string };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Body: { isActive: boolean };
  }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { id } = request.params;
  const { isActive } = request.body;

  const updated = await usersService.updateStatus(id, isActive);
  return reply.status(status.OK).send(updated);
}

export async function deleteUserController(
  request: FastifyRequest<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Params: { id: string };
  }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { id } = request.params;
  await usersService.deleteUser(id);
  return reply.status(status.OK).send({ success: true });
}

export async function resetPasswordController(
  request: FastifyRequest<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Params: { id: string };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Body: { newPassword?: string };
  }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { id } = request.params;
  const newPassword = request.body.newPassword;
  const minPasswordLength = 8;
  
  if (newPassword == null || newPassword.length < minPasswordLength) {
    return reply.status(status.BAD_REQUEST).send({ message: "הסיסמה חייבת להכיל לפחות 8 תווים" });
  }

  const result = await usersService.resetPassword(id, newPassword);
  return reply.status(status.OK).send(result);
}
