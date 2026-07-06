/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { FastifyInstance } from "fastify";
import { buildApp } from "../app";
import { prisma } from "../db/prisma/prisma";

describe("Auth Controller Integration Tests", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /api/auth/register", () => {
    it("should return 400 Bad Request when password is less than 8 characters", async () => {
      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: {
          email: "test-short-pass@example.com",
          password: "short",
          fullName: "Test User",
        },
      });

      // Assert
      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.payload);
      expect(body.success).toBe(false);
      expect(body.error).toBe("Validation Error");
      // Fastify schema validation wraps messages, so we check for the string we added
      expect(JSON.stringify(body)).toContain("הסיסמה חייבת להכיל לפחות 8 תווים");
    });

    it("should successfully register when password is 8 or more characters", async () => {
      // Arrange
      const email = `test-valid-${Date.now()}@example.com`;
      
      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: {
          email,
          password: "validpassword123",
          fullName: "Test User",
        },
      });

      // Assert
      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.payload);
      expect(body.message).toBe("User created successfully");
      expect(body.token).toBeDefined();

      // Clean up
      await prisma.user.delete({ where: { email } });
    });

    it("should return 400 Bad Request for duplicate email", async () => {
      // Arrange
      const email = `test-dup-${Date.now()}@example.com`;
      await prisma.user.create({
        data: {
          email,
          fullName: "Original User",
          passwordHash: "hashedpass",
          role: "ADMIN"
        }
      });

      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: {
          email,
          password: "anotherpassword123",
          fullName: "Duplicate User",
        },
      });

      // Assert
      expect(response.statusCode).toBe(409);
      const body = JSON.parse(response.payload);
      expect(body.error).toBe("User already exists");

      // Clean up
      await prisma.user.delete({ where: { email } });
    });
  });

  describe("POST /api/auth/login", () => {
    let testUserEmail: string;
    let testUserPass: string;

    beforeAll(async () => {
      testUserEmail = `test-login-${Date.now()}@example.com`;
      testUserPass = "validpassword123";
      await app.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: {
          email: testUserEmail,
          password: testUserPass,
          fullName: "Test Login User",
        },
      });
    });

    afterAll(async () => {
      await prisma.user.delete({ where: { email: testUserEmail } }).catch(() => {});
    });

    it("should return 401 Unauthorized for wrong password", async () => {
      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: {
          email: testUserEmail,
          password: "wrongpassword123",
        },
      });

      // Assert
      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.payload);
      expect(body.error).toBe("Invalid email or password");
    });

    it("should return 401 Unauthorized for non-existent email", async () => {
      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: {
          email: "doesnotexist@example.com",
          password: "somepassword",
        },
      });

      // Assert
      expect(response.statusCode).toBe(401);
    });

    it("should successfully login and return a token for valid credentials", async () => {
      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: {
          email: testUserEmail,
          password: testUserPass,
        },
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.message).toBe("Login successful");
      expect(body.token).toBeDefined();
    });
  });
});
