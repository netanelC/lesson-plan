import { FastifyInstance } from 'fastify';
import { CreateLessonPlanSchema } from '@repo/types';
import { lessonPlanController } from './controller';

// This function is a "Fastify Plugin"
// It encapsulates all the routes for this feature.
export async function lessonPlanRoutes(fastify: FastifyInstance) {
  
  // POST / (Create)
  fastify.post('/', {
    schema: {
      body: CreateLessonPlanSchema, // <--- The Gatekeeper!
    },
  }, lessonPlanController.create);

  // GET / (Get All)
  fastify.get('/', lessonPlanController.getAll);

  fastify.get('/:id', lessonPlanController.getOne);

  fastify.delete('/:id', lessonPlanController.delete);

  fastify.post('/:id/attachments', lessonPlanController.uploadAttachment);

  fastify.get('/attachments/:id/download', lessonPlanController.downloadAttachment);
}
