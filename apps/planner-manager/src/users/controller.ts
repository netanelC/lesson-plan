import { FastifyRequest, FastifyReply } from "fastify";
import { status } from "http-status";
import { ApiResponse, User, UserRole } from "@repo/types";
import { userService } from "./DAL";

export const userController = {
  getAll: async (
    req: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> => {
    try {
      const users = await userService.getAllUsers();
      
      const response: ApiResponse<User[]> = {
        success: true,
        data: users,
      };
      
      return await reply.code(status.OK).send(response);
    } catch (error) {
      req.log.error(error);
      const response: ApiResponse<null> = {
        success: false,
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
        statusCode: status.INTERNAL_SERVER_ERROR,
      };
      return reply.code(status.INTERNAL_SERVER_ERROR).send(response);
    }
  },

  updateRole: async (
    // eslint-disable-next-line @typescript-eslint/naming-convention
    req: FastifyRequest<{ Params: { id: string }; Body: { role: UserRole } }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> => {
    const { id } = req.params;
    const { role } = req.body;

    try {
      const updatedUser = await userService.updateUserRole(id, role);
      
      const response: ApiResponse<User> = {
        success: true,
        data: updatedUser,
      };
      
      return await reply.code(status.OK).send(response);
    } catch (error: unknown) {
      req.log.error(error); // Log the actual error for debugging
      const response: ApiResponse<null> = {
        success: false,
        error: "Update Failed",
        message: error instanceof Error ? error.message : "Could not update user role.",
        statusCode: status.BAD_REQUEST,
      };
      return reply.code(status.BAD_REQUEST).send(response);
    }
  },
};
