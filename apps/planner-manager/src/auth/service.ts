import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import config from "config";
import { Role, User } from "../db/prisma/generated/client";
import { prisma } from "../db/prisma/prisma";
import { LoginResult } from "./types";

const saltRounds = 10;
const clientId = config.get<string>("google.clientId");
const client = new OAuth2Client(clientId);

export const authService = {
  async register(
    email: string,
    password: string,
    fullName: string,
  ): Promise<Partial<User>> {
    // 1. Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error("User already exists");
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Create the user
    return prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName,
        role: Role.ADMIN, // Default to ADMIN so they can create content immediately
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });
  },

  async validateUser(email: string, password: string): Promise<LoginResult> {
    // 1. Find user
    const user = await prisma.user.findUnique({ where: { email } });

    // 2. Hybrid Check: If user exists but has no password (Google-only account)
    if (user?.passwordHash == null) {
      return null;
    }

    // 3. Verify Password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;

    // 4. Return safe user object (NO password!)
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  },

  async verifyGoogleToken(token: string): Promise<User> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (payload?.email == null) {
      throw new Error("Invalid Google Token");
    }

    // Upsert: Find user by email, or create them if they don't exist
    return prisma.user.upsert({
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
        role: Role.KINDERGARTEN,
      },
    });
  },
};
