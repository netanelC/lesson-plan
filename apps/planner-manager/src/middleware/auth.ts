import { FastifyRequest, FastifyReply } from 'fastify';

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    // 1. Check for the header (Bearer <token>)
    // 2. Verify the signature
    // 3. Attach payload to req.user
    await req.jwtVerify();
  } catch (err) {
    reply.send(err); // Sends 401 Unauthorized automatically
  }
}