import { FastifyRequest, FastifyReply } from "fastify";
import { RoleType } from "@repo/types";
import { prisma } from "../db/prisma/prisma";

export const userController = {
  // List all users for the management table
  getAll: async (req: FastifyRequest, reply: FastifyReply) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
    return users;
  },

  // Update a user's role
  updateRole: async (
    req: FastifyRequest<{ Params: { id: string }; Body: { role: RoleType } }>,
    reply: FastifyReply,
  ) => {
    const { id } = req.params;
    const { role } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return updated;
  },
};
