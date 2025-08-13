const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const { authorize } = require("../middlewares/auth");
const {
  validateUserBody,
  validateLogin,
} = require("../middlewares/validation");
const { NotFoundError } = require("../utils/errors");

// Import routers separately
const usersRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

// Public routes
router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);

// Protected routes
router.use("/users", authorize, usersRouter);
router.use("/items", clothingItemsRouter);

// 404 handler
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
