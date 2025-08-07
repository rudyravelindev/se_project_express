/* eslint-disable max-classes-per-file */

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends CustomError {
  constructor(message = "Invalid request") {
    super(message, 400);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = "Not authorized") {
    super(message, 401);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

class NotFoundError extends CustomError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

class ConflictError extends CustomError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

class ServerError extends CustomError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}

module.exports = {
  CustomError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ServerError,
};
