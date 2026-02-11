import { FastifyInstance } from 'fastify';
import { CreateLessonPlanSchema } from '@repo/types';
import { lessonPlanController } from './controller';
import { authenticate } from '../middleware/auth';

// This function is a "Fastify Plugin"
// It encapsulates all the routes for this feature.
export async function lessonPlanRoutes(fastify: FastifyInstance) {
  
  fastify.addHook('onRequest', authenticate);

  // Lesson Plan Routes
  fastify.post('/', { schema: { body: CreateLessonPlanSchema }, }, lessonPlanController.create);
  fastify.get('/', lessonPlanController.getAll);
  fastify.get('/:id', lessonPlanController.getOne);
  fastify.put('/:id', lessonPlanController.update);
  fastify.delete('/:id', lessonPlanController.delete);

  // Attachment Routes
  fastify.get('/attachments/:id/download', lessonPlanController.downloadAttachment);
  fastify.post('/:id/attachments', lessonPlanController.uploadAttachment);
  fastify.delete('/attachments/:fileId', lessonPlanController.removeAttachment);
}
