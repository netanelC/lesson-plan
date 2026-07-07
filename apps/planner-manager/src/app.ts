import { fastify, FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import { status } from "http-status";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import cors from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import config from "config";
import { lessonPlanRoutes } from "./lessonPlan/routes";
import { userRoutes } from "./users/routes";
import { authRoutes } from "./auth/routes";
import { AppError } from "./utils/errors";

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

  // Auth
  app.register(fastifyJwt, {
    secret: config.get<string>("jwt.secret"),
  });
  app.register(authRoutes, { prefix: "/api/auth" });

  // Users
  app.register(userRoutes, { prefix: "/api/users" });

  // Global Error Handler
  app.setErrorHandler((error: unknown, request, reply) => {
    if (error instanceof AppError) {
      if (!error.isOperational) {
        request.log.error({ err: error }, "Operational error");
      }
      return reply.status(error.statusCode).send({
        success: false,
        error: error.message,
      });
    }

    // Handle Fastify Validation Errors (Zod)
    const fastifyError = error as { validation?: unknown };
    if (
      fastifyError.validation !== undefined &&
      fastifyError.validation !== null
    ) {
      return reply.status(status.BAD_REQUEST).send({
        success: false,
        error: "Validation Error",
        details: fastifyError.validation,
      });
    }

    // Unhandled errors
    request.log.error({ err: error }, "Unhandled internal error");
    return reply.status(status.INTERNAL_SERVER_ERROR).send({
      success: false,
      error: "Internal Server Error",
    });
  });

  return app;
}
