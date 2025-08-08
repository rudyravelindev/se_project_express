const express = require("express");
const { celebrate, Joi } = require("celebrate");

const router = express.Router();

const {
  createItem,
  getItemById,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const createItemSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string().required().uri(),
  }),
});

const itemIdSchema = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

router.post("/", createItemSchema, createItem);
router.get("/:id", itemIdSchema, getItemById);
router.delete("/:id", itemIdSchema, deleteItem);
router.put("/:id/likes", itemIdSchema, likeItem);
router.delete("/:id/likes", itemIdSchema, dislikeItem);

module.exports = router;
