import { User, UserRole } from "@repo/types";
import { prisma } from "../db/prisma/prisma";

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    }));
  },

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    };
  },
};
