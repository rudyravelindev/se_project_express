// const mongoose = require("mongoose");
// const validator = require("validator");

// const clothingItemSchema = new mongoose.Schema({
//   name: { type: String, required: true, minlength: 2, maxlength: 30 },
//   weather: {
//     type: String,
//     required: true,
//   },
//   imageURL: {
//     type: String,
//     required: [true, "The avatar field is required."],
//     validate: {
//       validator(value) {
//         return validator.isURL(value);
//       },
//       message: "You must enter a valid URL",
//     },
//   },
// });

// module.exports = mongoose.model("clothingItems", clothingItemSchema);

const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Invalid URL format",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ClothingItem", clothingItemSchema);
