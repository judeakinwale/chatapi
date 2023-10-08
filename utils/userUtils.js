const fs = require("fs");
const ErrorResponse = require("./errorResponse");
const User = require("../models/User");

exports.loginWorkaround = async (payload) => {
  if (payload?.user) return payload;
  if (!payload?.email)
    throw new ErrorResponse("No user or email provided!", 400);

  payload.email = payload.email?.toLowerCase();

  const user = await User.findOne({ email: payload?.email });
  if (!user) throw new ErrorResponse("Invalid email provided!", 400);

  payload.user = user;
  return payload;
};
