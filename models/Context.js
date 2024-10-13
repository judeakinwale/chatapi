const mongoose = require("mongoose");

// store chat context in the database
const Context = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    type: {
      type: String,
      // example: project, handbook
    },
    topics: [
      {
        type: String,
      },
    ],
    context: {
      type: String,
      required: [true, "Please provide some context text or file(s)"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

Context.index({ chatId: "text" });

module.exports = mongoose.model("Context", Context);
