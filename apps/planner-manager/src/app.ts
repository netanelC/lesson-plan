import Fastify, { FastifyInstance } from "fastify";
import fastifyMultipart from "@fastify/multipart";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { lessonPlanRoutes } from "./lessonPlan";
import { authRoutes } from "./auth/routes";
import fastifyJwt from "@fastify/jwt";
import { userRoutes } from "./users/routes";
import cors from "@fastify/cors";

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  // Setup Zod (Validation)
  // We do this globally so we don't have to repeat it in every route
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Health Check (Just to prove it works)
  app.get("/health", async () => {
    return { status: "ok" };
  });

  // Solves CORS issues when running frontend and backend separately in development (e.g. via Docker)
  app.register(cors, {
    origin: true, // Allows all origins (good for local Docker dev)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });

  // Lesson Plan
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50 MB
    },
  });
  app.register(lessonPlanRoutes, { prefix: "/api/lessons" });

  // Auth
  // Register JWT (TODO: Move secret to .env later)
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "supersecret",
  });
  app.register(authRoutes, { prefix: "/api/auth" });

  // Users
  app.register(userRoutes, { prefix: "/api/users" });

  return app;
}
