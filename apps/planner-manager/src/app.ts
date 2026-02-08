import Fastify, { FastifyInstance } from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { lessonPlanRoutes } from './lessonPlan';

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  // 1. Setup Zod (Validation)
  // We do this globally so we don't have to repeat it in every route
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // 2. Health Check (Just to prove it works)
  app.get('/health', async () => {
    return { status: 'ok' };
  });

  app.register(fastifyMultipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50 MB
    }
  });
  app.register(lessonPlanRoutes, { prefix: '/api/lessons' });

  return app;
}
