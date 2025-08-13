const express = require("express");
const { celebrate, Joi } = require("celebrate");
const { authorize } = require("../middlewares/auth");

const router = express.Router();

const {
  createItem,
  getItems,
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

router.get("/", getItems);
router.post("/", authorize, createItemSchema, createItem);
router.get("/:id", itemIdSchema, getItemById);
router.delete("/:id", authorize, itemIdSchema, deleteItem);
router.put("/:id/likes", authorize, itemIdSchema, likeItem);
router.delete("/:id/likes", authorize, itemIdSchema, dislikeItem);

module.exports = router;
