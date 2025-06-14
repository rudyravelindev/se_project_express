const express = require("express");

const router = express.Router();
const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItems");

// GET
router.get("/", getItems);

// POST
router.post("/", createItem);

// DELETE
router.delete("/:itemId", deleteItem);

module.exports = router;
