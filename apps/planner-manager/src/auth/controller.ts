import { FastifyRequest, FastifyReply } from "fastify";
import { status } from "http-status";
import { LoginSchema, RegisterSchema } from "@repo/types";
import { authService } from "./service";

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    // 1. Validate Input
    const body = RegisterSchema.parse(request.body);

    // 2. Call Service
    const newUser = await authService.register(
      body.email,
      body.password,
      body.fullName,
    );

    // 3. Send Success
    return await reply.status(status.CREATED).send({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: unknown) {
    request.log.error({ err: error }, "Registration failed");

    if (error instanceof Error && error.message === "User already exists") {
      return reply
        .status(status.CONFLICT)
        .send({ message: "User already exists" });
    }

    return reply.status(status.BAD_REQUEST).send({
      message: "Registration failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    // 1. Validate Input
    const body = LoginSchema.parse(request.body);

    // 2. Verify Credentials
    const user = await authService.validateUser(body.email, body.password);

    if (!user) {
      // Generic error message for security (don't say "User not found")
      return await reply
        .status(status.UNAUTHORIZED)
        .send({ message: "Invalid email or password" });
    }

    // 3. Sign Token (The "Session Ticket")
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

    // 4. Send Response
    return await reply.status(status.OK).send({
      message: "Login successful",
      token,
      user,
    });
  } catch (error: unknown) {
    request.log.error({ err: error }, "Login failed");
    return reply.status(status.BAD_REQUEST).send({
      message: "Login failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function googleLoginController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const body = request.body as { token: string };
    const { token } = body;

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

    return await reply.status(status.OK).send({
      token: appToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error: unknown) {
    request.log.error({ err: error }, "Google authentication failed");
    return reply
      .status(status.UNAUTHORIZED)
      .send({ message: "Google authentication failed" });
  }
}
