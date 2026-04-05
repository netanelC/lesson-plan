import { FastifyInstance } from "fastify";
import {
  registerController,
  loginController,
  googleLoginController,
} from "./controller";

export function authRoutes(fastify: FastifyInstance): void {
  fastify.post("/register", registerController);
  fastify.post("/login", loginController);
  fastify.post("/google", googleLoginController);
}
