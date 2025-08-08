const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUpdateProfile } = require("../middlewares/validation");
const auth = require("../middlewares/auth");

router.use(auth);

router.get("/me", getCurrentUser);

router.patch("/me", validateUpdateProfile, updateProfile);

module.exports = router;
