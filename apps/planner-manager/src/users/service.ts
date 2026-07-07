import bcrypt from "bcryptjs";
import { Role, User } from "../db/prisma/generated/client";
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser as deleteUserDAL,
  updateUserPassword,
} from "./DAL";

export const usersService = {
  async getAll(): Promise<Partial<User>[]> {
    return getAllUsers();
  },

  async updateRole(id: string, role: Role): Promise<User> {
    return updateUserRole(id, role);
  },

  async updateStatus(id: string, isActive: boolean): Promise<User> {
    return updateUserStatus(id, isActive);
  },

  async deleteUser(id: string): Promise<User> {
    return deleteUserDAL(id);
  },

  async resetPassword(
    id: string,
    newPassword?: string,
  ): Promise<{ success: boolean; message: string }> {
    if (newPassword == null) {
      throw new Error("Missing new password");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await updateUserPassword(id, hashedPassword);
    return { success: true, message: "Password updated successfully" };
  },
};
