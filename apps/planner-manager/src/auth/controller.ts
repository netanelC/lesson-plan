import { FastifyRequest, FastifyReply } from "fastify";
import {
  LoginDto,
  RegisterDto,
  GoogleLoginDto,
  ApiResponse,
  User,
} from "@repo/types";
import { status } from "http-status";
import { authService } from "./DAL";

interface AuthResponseData {
  token: string;
  user: User;
}

export const authController = {
  register: async (
    // eslint-disable-next-line @typescript-eslint/naming-convention
    req: FastifyRequest<{ Body: RegisterDto }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> => {
    try {
      const newUser = await authService.register(
        req.body.email,
        req.body.password,
        req.body.fullName,
      );

      const response: ApiResponse<User> = { success: true, data: newUser };
      return await reply.code(status.CREATED).send(response);
    } catch (error: unknown) {
      req.log.error(error);
      if (!(error instanceof Error)) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Bad Request",
          message: "Registration failed",
          statusCode: status.BAD_REQUEST,
        };
        return reply.code(status.BAD_REQUEST).send(response);
      }
      const response: ApiResponse<null> = {
        success: false,
        error: "User Conflict",
        message: error.message,
        statusCode: status.CONFLICT,
      };
      return reply.code(status.CONFLICT).send(response);
    }
  },

  login: async (
    // eslint-disable-next-line @typescript-eslint/naming-convention
    req: FastifyRequest<{ Body: LoginDto }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> => {
    try {
      const user = await authService.validateUser(
        req.body.email,
        req.body.password,
      );

      if (!user) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Unauthorized",
          message: "Invalid email or password",
          statusCode: 401,
        };
        return await reply.code(status.UNAUTHORIZED).send(response);
      }

      const token = await reply.jwtSign(
        { id: user.id, email: user.email, role: user.role },
        { expiresIn: "7d" },
      );

      const response: ApiResponse<AuthResponseData> = {
        success: true,
        data: { token, user },
      };
      return await reply.send(response);
    } catch (error) {
      req.log.error(error);
      const response: ApiResponse<null> = {
        success: false,
        error: "Bad Request",
        message: "Login failed",
        statusCode: 400,
      };
      return reply.code(status.BAD_REQUEST).send(response);
    }
  },

  googleLogin: async (
    // eslint-disable-next-line @typescript-eslint/naming-convention
    req: FastifyRequest<{ Body: GoogleLoginDto }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> => {
    try {
      const user = await authService.verifyGoogleToken(req.body.token);

      const token = await reply.jwtSign(
        { id: user.id, email: user.email, role: user.role },
        { expiresIn: "7d" },
      );

      const response: ApiResponse<AuthResponseData> = {
        success: true,
        data: { token, user },
      };
      return await reply.send(response);
    } catch (error) {
      req.log.error(error);
      const response: ApiResponse<null> = {
        success: false,
        error: "Unauthorized",
        message: "Google authentication failed",
        statusCode: 401,
      };
      return reply.code(status.UNAUTHORIZED).send(response);
    }
  },
};
