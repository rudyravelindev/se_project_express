const CustomError = require("./CustomError");

class UnauthorizedError extends CustomError {
  constructor(message = "Not authorized") {
    super(message, 401);
  }
}

module.exports = UnauthorizedError;
