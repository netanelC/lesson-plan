import { FastifyInstance } from "fastify";
import { authController } from "./controller";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", authController.register);
  fastify.post("/login", authController.login);

  fastify.post("/google", authController.googleLogin);
}
