const express = require("express");
const {
  createUser,
  createTenantUser,
  getUsers,
  getTenantUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/User");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.route("/").post(createUser);
router.route("/").get(advancedResults(User), getUsers);
router.route("/tenant/").post(createTenantUser);
router.route("/tenant/:tenant").get(getTenantUsers);
router.route("/email/:email").get(getTenantUsers);
router.route("/:id").get(getUser);
router.route("/:id").patch(updateUser);
router.route("/:id").delete(deleteUser);
// router.route("/:id").delete(protect, authorize("SuperAdmin"), deleteUser);

module.exports = router;
