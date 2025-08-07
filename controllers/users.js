const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} = require("../utils/errors");

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  try {
    const user = await User.create({ name, avatar, email, password });
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).send(userResponse);
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError("Email already exists"));
    } else if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid user data"));
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    const userResponse = user.toObject();
    delete userResponse.password;
    res.send({ token, user: userResponse });
  } catch (err) {
    if (err.message === "Invalid credentials") {
      next(new UnauthorizedError("Authentication failed"));
    } else {
      next(err);
    }
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  const { name, avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }
    res.send(updatedUser);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError("Invalid data"));
    } else {
      next(err);
    }
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
