const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
  UnauthorizedError,
  ServerError,
} = require("../utils/errors");

const handleError = (err, req, res, next) => {
  console.error(err);

  // Handle all custom error instances
  if (
    err instanceof BadRequestError ||
    err instanceof NotFoundError ||
    err instanceof ForbiddenError ||
    err instanceof ConflictError ||
    err instanceof UnauthorizedError ||
    err instanceof ServerError
  ) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  // All other errors get a generic 500 response
  return res.status(500).send({ message: "An internal server error occurred" });
};

module.exports = handleError;
