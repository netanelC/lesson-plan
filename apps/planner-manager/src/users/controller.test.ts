/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/naming-convention */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { FastifyInstance } from "fastify";
import { buildApp } from "../app";
import { prisma } from "../db/prisma/prisma";
import { buildMockUser } from "../tests/factories/user.factory";

describe("Users Controller Integration Tests", () => {
  let app: FastifyInstance;
  
  // Roles users
  let ownerUser: { id: string; role: string; email: string };
  let adminUser: { id: string; role: string; email: string };
  let kinderUser: { id: string; role: string; email: string };
  let targetUser: { id: string; role: string; email: string };

  // Tokens
  let ownerToken: string;
  let adminToken: string;
  let kinderToken: string;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();

    // Setup Test Users
    ownerUser = await prisma.user.create({ data: buildMockUser({ role: "OWNER" }) });
    adminUser = await prisma.user.create({ data: buildMockUser({ role: "ADMIN" }) });
    kinderUser = await prisma.user.create({ data: buildMockUser({ role: "KINDERGARTEN" }) });
    targetUser = await prisma.user.create({ data: buildMockUser({ role: "KINDERGARTEN" }) });

    ownerToken = `Bearer ${app.jwt.sign({ id: ownerUser.id, role: ownerUser.role, email: ownerUser.email })}`;
    adminToken = `Bearer ${app.jwt.sign({ id: adminUser.id, role: adminUser.role, email: adminUser.email })}`;
    kinderToken = `Bearer ${app.jwt.sign({ id: kinderUser.id, role: kinderUser.role, email: kinderUser.email })}`;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        id: { in: [ownerUser.id, adminUser.id, kinderUser.id, targetUser.id] }
      }
    });
    await app.close();
  });

  describe("GET /api/users", () => {
    it("should return 200 and list users for OWNER", async () => {
      // Act
      const response = await app.inject({
        method: "GET",
        url: "/api/users",
        headers: { Authorization: ownerToken },
      });
      
      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    it("should return 200 and list users for ADMIN", async () => {
      // Act
      const response = await app.inject({
        method: "GET",
        url: "/api/users",
        headers: { Authorization: adminToken },
      });
      
      // Assert
      expect(response.statusCode).toBe(200);
    });

    it("should return 403 Forbidden for KINDERGARTEN role", async () => {
      // Act
      const response = await app.inject({
        method: "GET",
        url: "/api/users",
        headers: { Authorization: kinderToken },
      });
      
      // Assert
      expect(response.statusCode).toBe(403);
    });
  });

  describe("PATCH /api/users/:id/role", () => {
    it("should return 403 Forbidden for ADMIN", async () => {
      // Act
      const response = await app.inject({
        method: "PATCH",
        url: `/api/users/${targetUser.id}/role`,
        headers: { Authorization: adminToken },
        payload: { role: "ADMIN" },
      });
      
      // Assert
      expect(response.statusCode).toBe(403);
    });

    it("should successfully update role for OWNER", async () => {
      // Act
      const response = await app.inject({
        method: "PATCH",
        url: `/api/users/${targetUser.id}/role`,
        headers: { Authorization: ownerToken },
        payload: { role: "ADMIN" },
      });
      
      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.role).toBe("ADMIN");
    });
  });

  describe("PATCH /api/users/:id/status", () => {
    it("should return 403 Forbidden for ADMIN", async () => {
      // Act
      const response = await app.inject({
        method: "PATCH",
        url: `/api/users/${targetUser.id}/status`,
        headers: { Authorization: adminToken },
        payload: { isActive: false },
      });
      
      // Assert
      expect(response.statusCode).toBe(403);
    });

    it("should successfully update status for OWNER", async () => {
      // Act
      const response = await app.inject({
        method: "PATCH",
        url: `/api/users/${targetUser.id}/status`,
        headers: { Authorization: ownerToken },
        payload: { isActive: false },
      });
      
      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.isActive).toBe(false);
    });
  });

  describe("POST /api/users/:id/reset-password", () => {
    it("should return 400 Bad Request when newPassword is less than 8 characters", async () => {
      // Act
      const response = await app.inject({
        method: "POST",
        url: `/api/users/${targetUser.id}/reset-password`,
        headers: { Authorization: ownerToken },
        payload: { newPassword: "short" },
      });
      
      // Assert
      expect(response.statusCode).toBe(400);
    });

    it("should return 403 Forbidden if ADMIN tries to reset another user's password", async () => {
      // Act
      const response = await app.inject({
        method: "POST",
        url: `/api/users/${targetUser.id}/reset-password`,
        headers: { Authorization: adminToken },
        payload: { newPassword: "validpassword123" },
      });
      
      // Assert
      expect(response.statusCode).toBe(403);
    });

    it("should allow ADMIN to reset their OWN password", async () => {
      // Act
      const response = await app.inject({
        method: "POST",
        url: `/api/users/${adminUser.id}/reset-password`,
        headers: { Authorization: adminToken },
        payload: { newPassword: "validpassword123" },
      });
      
      // Assert
      expect(response.statusCode).toBe(200);
    });

    it("should allow OWNER to reset another user's password", async () => {
      // Act
      const response = await app.inject({
        method: "POST",
        url: `/api/users/${targetUser.id}/reset-password`,
        headers: { Authorization: ownerToken },
        payload: { newPassword: "validpassword123" },
      });
      
      // Assert
      expect(response.statusCode).toBe(200);
    });
  });

  describe("DELETE /api/users/:id", () => {
    let userToDeleteOwner: { id: string };

    beforeAll(async () => {
      userToDeleteOwner = await prisma.user.create({ data: buildMockUser() });
    });

    it("should return 403 Forbidden if ADMIN tries to delete another user", async () => {
      // Act
      const response = await app.inject({
        method: "DELETE",
        url: `/api/users/${userToDeleteOwner.id}`,
        headers: { Authorization: adminToken },
      });
      
      // Assert
      expect(response.statusCode).toBe(403);
    });

    it("should allow ADMIN to delete their OWN user", async () => {
      // Arrange
      const temporaryAdmin = await prisma.user.create({ data: buildMockUser({ role: "ADMIN" }) });
      const tempToken = `Bearer ${app.jwt.sign({ id: temporaryAdmin.id, role: "ADMIN", email: temporaryAdmin.email })}`;
      
      // Act
      const response = await app.inject({
        method: "DELETE",
        url: `/api/users/${temporaryAdmin.id}`,
        headers: { Authorization: tempToken },
      });
      
      // Assert
      expect(response.statusCode).toBe(200);
    });

    it("should allow OWNER to delete another user", async () => {
      // Act
      const response = await app.inject({
        method: "DELETE",
        url: `/api/users/${userToDeleteOwner.id}`,
        headers: { Authorization: ownerToken },
      });
      
      // Assert
      expect(response.statusCode).toBe(200);
    });
  });
});
