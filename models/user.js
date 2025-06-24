const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, "The avatar filed is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email address",
    },
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
});
userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("user", userSchema);
