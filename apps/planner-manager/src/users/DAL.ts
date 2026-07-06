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
      isActive: true,
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

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  fullName: string;
  role: Role;
}): Promise<Partial<User>> {
  return prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
    },
  });
}

export async function upsertGoogleUser(
  email: string,
  googleId: string,
  fullName: string,
  avatarUrl?: string | null,
): Promise<User> {
  return prisma.user.upsert({
    where: { email },
    update: {
      googleId,
      avatarUrl,
    },
    create: {
      email,
      fullName,
      googleId,
      avatarUrl,
      role: Role.KINDERGARTEN,
    },
  });
}

export async function updateUserStatus(
  id: string,
  isActive: boolean,
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: { isActive },
  });
}

export async function deleteUser(id: string): Promise<User> {
  return prisma.user.delete({
    where: { id },
  });
}

export async function updateUserPassword(
  id: string,
  passwordHash: string,
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: { passwordHash },
  });
}
