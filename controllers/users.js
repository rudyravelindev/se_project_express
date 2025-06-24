const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

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
    const user = await User.create({ name, avatar, email, password });

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

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.send({ token, user: userResponse });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(401).send({
      message: "Authentication failed",
      error: err.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
};
const updateProfile = async (req, res) => {
  const { name, avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send(updatedUser);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: "Invalid data", error: err.message });
    } else {
      res.status(500).send({ message: "Server error" });
    }
  }
};
module.exports = {
  getUsers,
  createUser,
  getUser,
  login,
  getCurrentUser,
  updateProfile,
};
