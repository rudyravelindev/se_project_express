const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUpdateProfile } = require("../middlewares/validation");
const { authorize } = require("../middlewares/auth");

router.use(authorize);
router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateProfile, updateProfile);

module.exports = router;
