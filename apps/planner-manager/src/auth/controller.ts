import { FastifyRequest, FastifyReply } from "fastify";
import { status } from "http-status";
import { Login, Register } from "@repo/types";
import { UnauthorizedError } from "../utils/errors";
import { authService } from "./service";

export async function registerController(
  request: FastifyRequest<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Body: Register;
  }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  // 1. Call Service (Validation happens in fastify routes)
  const newUser = await authService.register(
    request.body.email,
    request.body.password,
    request.body.fullName,
  );

  // 2. Send Success
  return reply.status(status.CREATED).send({
    message: "User created successfully",
    user: newUser,
  });
}

export async function loginController(
  request: FastifyRequest<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Body: Login;
  }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  // 1. Verify Credentials (Validation happens in fastify routes)
  const user = await authService.validateUser(
    request.body.email,
    request.body.password,
  );

  if (!user) {
    // Generic error message for security (don't say "User not found")
    throw new UnauthorizedError("Invalid email or password");
  }

  // 2. Sign Token (The "Session Ticket")
  const token = await reply.jwtSign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    {
      expiresIn: "7d", // Token valid for 1 week
    },
  );

  // 3. Send Response
  return reply.status(status.OK).send({
    message: "Login successful",
    token,
    user,
  });
}

export async function googleLoginController(
  request: FastifyRequest<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Body: { token: string };
  }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { token } = request.body;

  // 1. Verify token and get/create user in DB
  const user = await authService.verifyGoogleToken(token);

  // 2. Sign JWT for our app
  const appToken = await reply.jwtSign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    { expiresIn: "7d" },
  );

  return reply.status(status.OK).send({
    token: appToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
  });
}
