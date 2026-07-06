/* eslint-disable @typescript-eslint/no-misused-promises */
import { FastifyInstance } from "fastify";
import { status } from "http-status";
import { authenticate } from "../middleware/auth";
import { 
  getAllUsersController, 
  updateUserRoleController,
  updateUserStatusController,
  deleteUserController,
  resetPasswordController
} from "./controller";

export function userRoutes(fastify: FastifyInstance): void {
  fastify.addHook("onRequest", authenticate);

  fastify.get(
    "/",
    {
      preHandler: async (request, reply) => {
        if (request.user.role !== "OWNER" && request.user.role !== "ADMIN") {
          await reply
            .status(status.FORBIDDEN)
            .send({ message: "Only Admins and Owners can view users" });
          return;
        }
      },
    },
    getAllUsersController,
  );

  fastify.patch(
    "/:id/role",
    {
      preHandler: async (request, reply) => {
        if (request.user.role !== "OWNER") {
          await reply
            .status(status.FORBIDDEN)
            .send({ message: "Only the Owner can manage roles" });
          return;
        }
      },
    },
    updateUserRoleController,
  );

  fastify.patch(
    "/:id/status",
    {
      preHandler: async (request, reply) => {
        if (request.user.role !== "OWNER") {
          await reply
            .status(status.FORBIDDEN)
            .send({ message: "Only the Owner can manage user status" });
          return;
        }
      },
    },
    updateUserStatusController,
  );

  fastify.delete(
    "/:id",
    {
      preHandler: async (request, reply) => {
        const { id } = request.params as { id: string };
        if (request.user.role !== "OWNER" && request.user.id !== id) {
          await reply
            .status(status.FORBIDDEN)
            .send({ message: "Only the Owner can delete other users" });
          return;
        }
      },
    },
    deleteUserController,
  );

  fastify.post(
    "/:id/reset-password",
    {
      preHandler: async (request, reply) => {
        const { id } = request.params as { id: string };
        if (request.user.role !== "OWNER" && request.user.id !== id) {
          await reply
            .status(status.FORBIDDEN)
            .send({ message: "Only the Owner can reset other user passwords" });
          return;
        }
      },
    },
    resetPasswordController,
  );
}
