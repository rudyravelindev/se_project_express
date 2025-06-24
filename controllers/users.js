const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT,
} = require("../utils/errors");
const bcrypt = require("bcryptjs");

const getUsers = (req, res) => {
  User.find({})
    .select("-password")
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  try {
    // Create user - password hashing happens automatically via the pre('save') hook
    const user = await User.create({ name, avatar, email, password });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).send(userResponse);
  } catch (err) {
    console.error("Error creating user:", err);

    if (err.code === 11000) {
      return res.status(409).send({
        message: "Email already exists",
        error: err.message,
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }

    res.status(500).send({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .select("-password")
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid user ID format" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getUsers, createUser, getUser };
