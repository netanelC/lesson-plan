import { fastify, FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import cors from "@fastify/cors";
import { lessonPlanRoutes } from "./lessonPlan/routes";

export function buildApp(): FastifyInstance {
  const app = fastify({ logger: true });

  // Setup Zod (Validation)
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.get("/health", () => {
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
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  });

  app.register(lessonPlanRoutes, { prefix: "/api/lessons" });

  return app;
}
