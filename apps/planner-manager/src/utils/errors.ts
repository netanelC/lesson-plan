import { status } from "http-status";

export class AppError extends Error {
  public constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  public constructor(message = "Not Found") {
    super(status.NOT_FOUND, message);
  }
}

export class ForbiddenError extends AppError {
  public constructor(message = "Forbidden") {
    super(status.FORBIDDEN, message);
  }
}

export class BadRequestError extends AppError {
  public constructor(message = "Bad Request") {
    super(status.BAD_REQUEST, message);
  }
}

export class ConflictError extends AppError {
  public constructor(message = "Conflict") {
    super(status.CONFLICT, message);
  }
}

export class UnauthorizedError extends AppError {
  public constructor(message = "Unauthorized") {
    super(status.UNAUTHORIZED, message);
  }
}

export class InternalServerError extends AppError {
  public constructor(message = "Internal Server Error") {
    super(status.INTERNAL_SERVER_ERROR, message, false);
  }
}
