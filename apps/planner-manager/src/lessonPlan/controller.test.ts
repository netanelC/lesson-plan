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

    it("should correctly filter lesson plans by authorId", async () => {
      // Arrange
      await prisma.lessonPlan.create({ data: buildMockLessonPlan({ authorId: testUser.id }) });

      // Act
      const response = await app.inject({
        method: "GET",
        url: `/api/lessons?authorId=${testUser.id}`,
        headers: { Authorization: authHeader },
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload) as { data: { authorId: string }[] };
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.every((p: { authorId: string }) => p.authorId === testUser.id)).toBe(true);
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

    it("should return 404 when trying to update a non-existent lesson plan", async () => {
      // Act
      const response = await app.inject({
        method: "PUT",
        url: "/api/lessons/non-existent-id",
        headers: { Authorization: authHeader },
        payload: { topic: "Updated Topic" },
      });

      // Assert
      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.payload);
      expect(body.error).toBe("המערך לא נמצא");
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

    it("should return 404 when trying to delete a non-existent lesson plan", async () => {
      // Act
      const response = await app.inject({
        method: "DELETE",
        url: "/api/lessons/non-existent-id",
        headers: { Authorization: authHeader },
      });

      // Assert
      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.payload);
      expect(body.error).toBe("המערך לא נמצא");
    });
  });

  describe("Bookmarks", () => {
    it("should toggle save/unsave for a lesson plan", async () => {
      // Arrange
      const plan = await prisma.lessonPlan.create({ data: buildMockLessonPlan({ authorId: testUser.id }) });

      // Act 1: Save
      const saveResponse = await app.inject({
        method: "POST",
        url: `/api/lessons/${plan.id}/save`,
        headers: { Authorization: authHeader },
      });

      // Assert 1
      expect(saveResponse.statusCode).toBe(200);
      let body = JSON.parse(saveResponse.payload);
      expect(body.success).toBe(true);
      expect(body.data.saved).toBe(true);

      // Act 2: Unsave
      const unsaveResponse = await app.inject({
        method: "POST",
        url: `/api/lessons/${plan.id}/save`,
        headers: { Authorization: authHeader },
      });

      // Assert 2
      expect(unsaveResponse.statusCode).toBe(200);
      body = JSON.parse(unsaveResponse.payload);
      expect(body.success).toBe(true);
      expect(body.data.saved).toBe(false);
    });

    it("should fetch saved lesson plans", async () => {
      // Arrange
      const plan1 = await prisma.lessonPlan.create({ data: buildMockLessonPlan({ authorId: testUser.id }) });
      const plan2 = await prisma.lessonPlan.create({ data: buildMockLessonPlan({ authorId: testUser.id }) });

      await prisma.savedLessonPlan.create({
        data: {
          userId: testUser.id,
          lessonPlanId: plan1.id,
        },
      });

      // Act
      const response = await app.inject({
        method: "GET",
        url: "/api/lessons/saved",
        headers: { Authorization: authHeader },
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload) as { data: { id: string }[] };
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBeGreaterThanOrEqual(1);
      // Ensure plan1 is in the returned list
      const savedIds = body.data.map((p) => p.id);
      expect(savedIds).toContain(plan1.id);
      expect(savedIds).not.toContain(plan2.id);
    });
  });

  describe("Authentication", () => {
    it("should return 401 Unauthorized when missing token on protected routes", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/lessons",
        payload: { topic: "Test" },
      });
      expect(response.statusCode).toBe(401);
    });
  });
});
