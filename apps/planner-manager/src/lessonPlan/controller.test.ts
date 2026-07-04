/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/naming-convention */
import fs from "fs";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { FastifyInstance } from "fastify";
import { buildApp } from "../app";
import { prisma } from "../db/prisma/prisma";
import { buildMockUser } from "../tests/factories/user.factory";
import { buildMockLessonPlan } from "../tests/factories/lessonplan.factory";

describe("LessonPlan Controller Integration Tests", () => {
  let app: FastifyInstance;
  let testUser: { id: string; role: string; email: string };
  let authHeader: string;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();

    // Setup Test User
    const userData = buildMockUser();
    testUser = await prisma.user.create({ data: userData });
    const token = app.jwt.sign({ id: testUser.id, role: testUser.role, email: testUser.email });
    authHeader = `Bearer ${token}`;
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /api/lessons", () => {
    it("should successfully create a lesson plan and return 201", async () => {
      // Arrange
      const mockPlan = buildMockLessonPlan({ 
        authorId: testUser.id,
        operativeGoals: ["Goal 1", "Goal 2", "Goal 3"],
      });
      // Remove db-specific id, createdAt, updatedAt for creation payload
      const { id, createdAt, updatedAt, authorId, ...payload } = mockPlan;

      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/lessons",
        headers: { Authorization: authHeader },
        payload,
      });

      // Assert
      const body = JSON.parse(response.payload);
      if (response.statusCode !== 201) fs.writeFileSync('post_error.json', JSON.stringify(body, null, 2));
      expect(response.statusCode).toBe(201);
      expect(body.success).toBe(true);
      expect(body.data.topic).toBe(payload.topic);
      expect(body.data.authorId).toBe(testUser.id);
    });

    it("should return 400 Bad Request when topic is too short", async () => {
      // Arrange
      const mockPlan = buildMockLessonPlan({ 
        authorId: testUser.id,
        operativeGoals: ["Goal 1", "Goal 2", "Goal 3"],
      });
      const { id, createdAt, updatedAt, authorId, ...payload } = mockPlan;
      payload.topic = "A"; // Invalid length

      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/lessons",
        headers: { Authorization: authHeader },
        payload,
      });

      // Assert
      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.payload);
      expect(body.success).toBe(false);
      expect(body.error).toBe("Validation Error");
    });
  });

  describe("GET /api/lessons", () => {
    it("should fetch paginated lesson plans", async () => {
      // Arrange
      await prisma.lessonPlan.create({ data: buildMockLessonPlan({ authorId: testUser.id }) });
      await prisma.lessonPlan.create({ data: buildMockLessonPlan({ authorId: testUser.id }) });

      // Act
      const response = await app.inject({
        method: "GET",
        url: "/api/lessons?page=1&limit=10",
        headers: { Authorization: authHeader },
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.meta.total).toBeGreaterThanOrEqual(2);
    });
  });

  describe("GET /api/lessons/:id", () => {
    it("should return 404 when lesson plan is not found", async () => {
      // Act
      const response = await app.inject({
        method: "GET",
        url: "/api/lessons/non-existent-id",
        headers: { Authorization: authHeader },
      });

      // Assert
      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.payload);
      expect(body.error).toBe("Lesson plan not found");
    });
  });

  describe("PUT /api/lessons/:id", () => {
    it("should successfully update an existing lesson plan", async () => {
      // Arrange
      const plan = await prisma.lessonPlan.create({ 
        data: buildMockLessonPlan({ authorId: testUser.id, operativeGoals: ["1", "2", "3"] }) 
      });
      const newTopic = "Updated Topic";

      // Act
      const response = await app.inject({
        method: "PUT",
        url: `/api/lessons/${plan.id}`,
        headers: { Authorization: authHeader },
        payload: { topic: newTopic },
      });

      // Assert
      const body = JSON.parse(response.payload);
      if (response.statusCode !== 200) fs.writeFileSync('put_error.json', JSON.stringify(body, null, 2));
      expect(response.statusCode).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.topic).toBe(newTopic);
    });
  });

  describe("DELETE /api/lessons/:id", () => {
    it("should delete an existing lesson plan", async () => {
      // Arrange
      const plan = await prisma.lessonPlan.create({ data: buildMockLessonPlan({ authorId: testUser.id }) });

      // Act
      const response = await app.inject({
        method: "DELETE",
        url: `/api/lessons/${plan.id}`,
        headers: { Authorization: authHeader },
      });

      // Assert
      expect(response.statusCode).toBe(204);
      
      const checkDb = await prisma.lessonPlan.findUnique({ where: { id: plan.id } });
      expect(checkDb).toBeNull();
    });
  });
});
