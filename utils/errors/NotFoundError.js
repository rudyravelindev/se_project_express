const CustomError = require("./CustomError");

class NotFoundError extends CustomError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

module.exports = NotFoundError;
