import { Role, User } from "../db/prisma/generated/client";
import { getAllUsers, updateUserRole } from "./DAL";

export const usersService = {
  async getAll(): Promise<Partial<User>[]> {
    return getAllUsers();
  },

  async updateRole(id: string, role: Role): Promise<User> {
    return updateUserRole(id, role);
  },
};
