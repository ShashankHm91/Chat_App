const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  resetPassword,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.post("/resetPassword", resetPassword);
router.post("/setavatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);
router.get("/logout/:id", logOut);

module.exports = router;
