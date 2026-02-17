import { FastifyInstance } from "fastify";
import { status } from "http-status";
import { ApiResponse, updateUserRoleSchema } from "@repo/types";
import { authenticate } from "../middleware/auth";
import { userController } from "./controller";

export function userRoutes(fastify: FastifyInstance): void {
  fastify.addHook("onRequest", authenticate);

  // Custom check: only allow OWNER
  fastify.addHook("preHandler", async (req, reply) => {
    if (req.user.role !== "OWNER") {
      const response: ApiResponse<null> = {
        success: false,
        error: "Forbidden",
        message: "Only the Owner can manage users",
        statusCode: status.FORBIDDEN,
      };
      return reply.code(status.FORBIDDEN).send(response);
    }
  });

  fastify.get("/", userController.getAll);
  fastify.patch("/:id/role", 
    {
      schema: {
        body: updateUserRoleSchema,
      },
    },
    userController.updateRole);
}
