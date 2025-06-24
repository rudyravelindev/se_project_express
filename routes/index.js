const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", clothingItemsRouter);

// Auth middleware
router.use(auth);

// 404 handler
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
