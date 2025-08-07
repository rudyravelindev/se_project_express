const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
  UnauthorizedError,
  InternalServerError,
} = require("../utils/errors");

const handleError = (err, req, res, next) => {
  console.error(err);

  if (
    err instanceof BadRequestError ||
    err instanceof NotFoundError ||
    err instanceof ForbiddenError ||
    err instanceof ConflictError ||
    err instanceof UnauthorizedError
  ) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).send({ message: "Invalid data format" });
  }

  return res.status(500).send({ message: "An internal server error occurred" });
};

module.exports = handleError;
