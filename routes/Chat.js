const express = require("express");
const {
  createChat,
  getChats,
  getChat,
  updateChat,
  deleteChat,
} = require("../controllers/Chat");
const Chat = require("../models/Chat");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.route("/").post(createChat);
router.route("/").get(advancedResults(Chat), getChats);
router.route("/:id").get(getChat);
router.route("/:id").patch(updateChat);
router.route("/:id").delete(protect, authorize("SuperAdmin"), deleteChat);

module.exports = router;
