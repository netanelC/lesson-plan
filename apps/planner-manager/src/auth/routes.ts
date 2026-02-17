import { FastifyInstance } from "fastify";
import { googleLoginSchema, loginSchema, registerSchema } from "@repo/types";
import { authController } from "./controller";

export function authRoutes(fastify: FastifyInstance): void {
  fastify.post(
    "/register",
    {
      schema: { body: registerSchema },
    },
    authController.register,
  );

  fastify.post(
    "/login",
    {
      schema: { body: loginSchema },
    },
    authController.login,
  );

  fastify.post(
    "/google",
    { schema: { body: googleLoginSchema } },
    authController.googleLogin,
  );
}
