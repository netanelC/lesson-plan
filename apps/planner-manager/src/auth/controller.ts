import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { LoginSchema, RegisterSchema } from '@repo/types'; 
import { authService } from './service';

export const authController = {
  register: async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      // 1. Validate Input
      const body = RegisterSchema.parse(req.body);

      // 2. Call Service
      const newUser = await authService.register(body.email, body.password, body.fullName);

      // 3. Send Success
      return reply.code(201).send({ 
        message: 'User created successfully', 
        user: newUser 
      });

    } catch (error: any) {
      req.log.error(error);
      
      if (error.message === 'User already exists') {
        return reply.code(409).send({ message: 'User already exists' }); // 409 Conflict
      }
      
      return reply.code(400).send({ message: 'Registration failed', error });
    }
  },

  login: async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      // 1. Validate Input
      const body = LoginSchema.parse(req.body);

      // 2. Verify Credentials
      const user = await authService.validateUser(body.email, body.password);
      
      if (!user) {
        // Generic error message for security (don't say "User not found")
        return reply.code(401).send({ message: 'Invalid email or password' });
      }

      // 3. Sign Token (The "Session Ticket")
      const token = await reply.jwtSign({
        id: user.id,
        email: user.email,
        role: user.role
      }, {
        expiresIn: '7d' // Token valid for 1 week
      });

      // 4. Send Response
      return reply.send({
        message: 'Login successful',
        token,
        user
      });

    } catch (error) {
      req.log.error(error);
      return reply.code(400).send({ message: 'Login failed', error });
    }
  },

  googleLogin: async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { token } = req.body as { token: string };
      
      // 1. Verify token and get/create user in DB
      const user = await authService.verifyGoogleToken(token);

      // 2. Sign JWT for our app
      const appToken = await reply.jwtSign({
        id: user.id,
        email: user.email,
        role: user.role
      }, { expiresIn: '7d' });

      return reply.send({
        token: appToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      });
    } catch (error) {
      req.log.error(error);
      return reply.code(401).send({ message: 'Google authentication failed' });
    }
  }
};