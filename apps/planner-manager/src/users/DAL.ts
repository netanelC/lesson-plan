import { prisma } from "../db/prisma/prisma";
import { Role, User } from "../db/prisma/generated/client";

export async function getAllUsers(): Promise<Partial<User>[]> {
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
}

export async function updateUserRole(id: string, role: Role): Promise<User> {
  const updated = await prisma.user.update({
    where: { id },
    data: { role },
  });
  return updated;
}
