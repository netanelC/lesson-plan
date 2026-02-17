import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import config from "config";
import { User } from "@repo/types";
import { prisma } from "../db/prisma/prisma";

const clientId = config.get<string>("google.clientId");
const client = new OAuth2Client(clientId);

export const authService = {
  async register(
    email: string,
    password: string,
    fullName: string,
  ): Promise<User> {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error("User already exists");
    }

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName,
        role: "ADMIN",
      },
    });

    // 3. Map Prisma output to Shared Interface
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    };
  },

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user?.passwordHash == null) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    };
  },

  async verifyGoogleToken(token: string): Promise<User> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (payload?.email == null) throw new Error("Invalid Google Token");

    const user = await prisma.user.upsert({
      where: { email: payload.email },
      update: {
        googleId: payload.sub,
        avatarUrl: payload.picture,
      },
      create: {
        email: payload.email,
        fullName: payload.name ?? "Google User",
        googleId: payload.sub,
        avatarUrl: payload.picture,
        role: "KINDERGARTEN",
      },
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    };
  },
};
