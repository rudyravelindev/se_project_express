const router = require("express").Router();

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

// Mount route handlers
router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

// Handle unknown routes (404)
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
