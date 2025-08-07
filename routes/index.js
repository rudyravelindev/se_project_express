const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateCardBody,
  validateUserBody,
  validateLogin,
  validateId,
} = require("../middlewares/validation");
const { NotFoundError } = require("../utils/errors"); // Import the error class

// Public routes
router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);

// Mount sub-routers
router.use("/items", require("./clothingItems"));
router.use("/users", auth, require("./users"));

// 404 handler - now throws error instead of sending response directly
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
