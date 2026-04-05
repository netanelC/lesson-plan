import { FastifyInstance } from "fastify";
import { status } from "http-status";
import { authenticate } from "../middleware/auth";
import { getAllUsersController, updateUserRoleController } from "./controller";

export function userRoutes(fastify: FastifyInstance): void {
  fastify.addHook("onRequest", authenticate);

  // Custom check: only allow OWNER
  fastify.addHook("preHandler", async (request, reply) => {
    if (request.user.role !== "OWNER") {
      return reply
        .status(status.FORBIDDEN)
        .send({ message: "Only the Owner can manage users" });
    }
  });

  fastify.get("/", getAllUsersController);
  fastify.patch("/:id/role", updateUserRoleController);
}
