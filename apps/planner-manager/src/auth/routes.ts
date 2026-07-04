import { FastifyInstance } from "fastify";
import { LoginSchema, RegisterSchema } from "@repo/types";
import {
  registerController,
  loginController,
  googleLoginController,
} from "./controller";

export function authRoutes(fastify: FastifyInstance): void {
  fastify.post(
    "/register",
    {
      schema: {
        body: RegisterSchema,
      },
    },
    registerController,
  );
  fastify.post(
    "/login",
    {
      schema: {
        body: LoginSchema,
      },
    },
    loginController,
  );
  fastify.post("/google", googleLoginController);
}
