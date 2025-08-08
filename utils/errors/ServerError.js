const CustomError = require("./CustomError");

class ServerError extends CustomError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}

module.exports = ServerError;
