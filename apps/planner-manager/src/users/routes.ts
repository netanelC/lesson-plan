import { FastifyInstance } from 'fastify';
import { userController } from './controller';
import { authenticate } from '../middleware/auth';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);
  
  // Custom check: only allow OWNER
  fastify.addHook('preHandler', async (req, reply) => {
    if (req.user.role !== 'OWNER') {
      return reply.code(403).send({ message: 'Only the Owner can manage users' });
    }
  });

  fastify.get('/', userController.getAll);
  fastify.patch('/:id/role', userController.updateRole);
}
