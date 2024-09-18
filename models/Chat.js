const mongoose = require("mongoose");

const Chat = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    type: {
      type: String,
      enum: ["chat", "whatsapp", "messenger", "instagram"], // Enum to identify if the sender is the user or bot
      default: "chat",
      required: true,
    },
    messages: [
      {
        text: {
          type: String,
          required: true,
        },
        sender: {
          type: String,
          enum: ["user", "bot", "agent"], // Enum to identify if the sender is the user or bot
          default: "user",
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
          required: true,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: this.user,
    },
  },
  { timestamps: true }
);

Chat.index({ chatId: "text", user: "text" });

module.exports = mongoose.model("Chat", Chat);
