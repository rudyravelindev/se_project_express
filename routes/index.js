const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const {
  getItems,
  createItem,
  getItemById,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems"); // Added missing exports
const auth = require("../middlewares/auth");
const {
  validateCardBody,
  validateUserBody,
  validateLogin,
  validateId,
} = require("../middlewares/validation");
const { NOT_FOUND } = require("../utils/errors");

// Public routes
router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);
router.get("/items", getItems);

// Protected routes (require authentication)
router.use(auth);
router.post("/items", validateCardBody, createItem);
router.get("/items/:id", validateId, getItemById);
router.delete("/items/:id", validateId, deleteItem); // Added missing route
router.put("/items/:id/likes", validateId, likeItem); // Added missing route
router.delete("/items/:id/likes", validateId, dislikeItem); // Added missing route

// Mount sub-routers
router.use("/users", require("./users"));
router.use("/items", require("./clothingItems"));

// 404 handler
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
