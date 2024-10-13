const express = require("express");
const {
  createContext,
  getContexts,
  getContext,
  updateContext,
  deleteContext,
} = require("../controllers/Context");
const Context = require("../models/Context");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.route("/").post(createContext);
router.route("/").get(advancedResults(Context), getContexts);
router.route("/:id").get(getContext);
router.route("/:id").patch(updateContext);
router.route("/:id").delete(deleteContext);
// router.route("/:id").delete(protect, authorize("SuperAdmin"), deleteContext);

module.exports = router;
