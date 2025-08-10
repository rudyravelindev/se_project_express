const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateUserBody,
  validateLogin,
} = require("../middlewares/validation");
const { NotFoundError } = require("../utils/errors");

// Public routes
router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);

// Protected routes
router.use("/users", auth, require("./users"));
router.use("/items", auth, require("./clothingItems"));

// 404 handler
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
