const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");
const bcrypt = require("bcryptjs");

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
      return res.status(CONFLICT).send({
        message: "Email already exists",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({
        message: "Invalid input. Please check the data and try again.",
      });
    }

    res.status(SERVER_ERROR).send({
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({
      message: "Email and password are required",
    });
  }

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    const userResponse = user.toObject();
    delete userResponse.password;

    res.send({ token, user: userResponse });
  } catch (err) {
    console.error("Login error:", err.message);

    if (err.message === "Invalid credentials") {
      return res.status(UNAUTHORIZED).send({
        message: "Authentication failed",
      });
    }

    res.status(SERVER_ERROR).send({
      message: "Internal server error",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }
    res.send(user);
  } catch (err) {
    res.status(SERVER_ERROR).send({ message: "Server error" });
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
    ).select("-password");

    if (!updatedUser) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    res.send(updatedUser);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(BAD_REQUEST).send({ message: "Invalid data" });
    } else {
      res.status(SERVER_ERROR).send({ message: "Server error" });
    }
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
