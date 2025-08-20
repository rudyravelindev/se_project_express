const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUpdateProfile } = require("../middlewares/validation");
const { authorize } = require("../middlewares/auth"); // <-- add this

// Only authorized users can access these routes
router.get("/me", authorize, getCurrentUser);
router.patch("/me", authorize, validateUpdateProfile, updateProfile);

module.exports = router;
