import { FastifyRequest, FastifyReply } from "fastify";
import { status } from "http-status";
import { prisma } from "../db/prisma/prisma";

export async function authenticate(
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    // 1. Check for the header (Bearer <token>)
    // 2. Verify the signature
    // 3. Attach payload to req.user
    await req.jwtVerify();
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { isActive: true },
    });
    if (user == null) {
      throw new Error("המשתמש לא קיים");
    }
    if (!user.isActive) {
      throw new Error("המשתמש מושעה");
    }
  } catch (err: unknown) {
    req.log.error({ err }, "Authentication failed");
    const message = err instanceof Error ? err.message : "Unauthorized";
    await reply.status(status.UNAUTHORIZED).send({
      success: false,
      error: "Unauthorized",
      message,
    });
  }
}
