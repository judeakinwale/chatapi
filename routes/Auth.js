const express = require("express");
const {
  createUser,
  login,
  getMe,
  getUsers,
  getUser,
  updateUser,
  updateProfile,
  deleteUser,
  forgotPassword,
  resetPassword,
  newPassword,

  activateSelf,
  uploadPhoto,
  activateUser,
  deactivateUser,
  getUserByEmail,
  updateUserByEmail,
  postUserDetails,
  inviteUser,
  getMeByEmail,
  updateProfileByEmail,
} = require("../controllers/Auth");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const router = express.Router();

router.route("/").post(createUser).get(advancedResults(User), getUsers);
router.route("/login").post(login);
router.route("/ad").post(postUserDetails); // login or create account using MS graph
router.route("/invite").post(inviteUser); // login or create account using MS graph
router.route("/login/ad").post(postUserDetails);

// Move /me route after /:id route
router.route("/me").get(protect, getMe).put(protect, updateProfile);
router.route("/me/email/:email").get(getMeByEmail).put(updateProfileByEmail);

router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/newpassword", protect, newPassword);

router
  .route("/:id")
  .delete(protect, authorize("SuperAdmin"), deleteUser)
  .get(getUser)
  .put(updateUser);

router.route("email/:email").get(getUserByEmail).put(updateUserByEmail);
router.route("/activate/:token").get(activateSelf);
router.route("/:id/photo").post(uploadPhoto);
router.route("/:id/activate").patch(activateUser);
router.route("/:id/deactivate").patch(deactivateUser);

module.exports = router;
