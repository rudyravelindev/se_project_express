const CustomError = require("./CustomError");

class ConflictError extends CustomError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

module.exports = ConflictError;
