// const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Chat = require("../models/Chat");
const {
  updateMetaData,
} = require("../utils/utils");
const { getResponseAI, getResponseOpenAI } = require("../utils/chatUtils");

// @desc    Create Chat/
// @route   POST  /api/v1/chat/
// @access   Public
exports.createChat = asyncHandler(async (req, res, next) => {
  updateMetaData(req.body, req.user?._id);
  req.body.user = req.body.user || req.user?._id

  const { user = req.user?._id, text } = req.body;
  if (!text) return next(new ErrorResponse(`Please enter a question!`, 400));

  // const prompt = [{role: "user", content: text}]

  // const openaiResponse = await getResponseOpenAI()
  const response = await getResponseAI(text, req);
  // const response = await getChatResponseAI(prompt, req);
  const payload = { text: response, sender: "bot" };
  // console.log({ openaiResponse });
  console.log({response})

  const data = await Chat.create(req.body);
  if (!data) return next(new ErrorResponse(`Chat not found!`, 400));

  // data.user = user || data.user;
  data.messages.push({ text });
  data.messages.push(payload);
  console.log({ user, text, payload });
  await data.save();

  res.status(201).json({
    success: true,
    data,
  });
});

// @desc    Get All Chat
// @route   POST  /api/v1/chat/
// @access   Private/Admin
exports.getChats = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get Single Chat
// @route   GET /api/v1/chat/:id
// @access   Private/Admin
exports.getChat = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) return next(new ErrorResponse(`Chat Id not provided`, 400));

  const data = await Chat.findById(id);
  if (!data) return next(new ErrorResponse(`Chat not found!`, 404));

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Update Chat
// @route   PATCH api/v1/chat/:id
// @access   Private
exports.updateChat = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) return next(new ErrorResponse(`Chat Id not provided`, 400));
  
  const {user = req.user?._id, text} = req.body
  if (!text) return next(new ErrorResponse(`Please enter a question!`, 400));

  const response = await getResponseAI(text, req)
  const payload = {text: response, sender: "bot"}

  const data = await Chat.findById(id);
  if (!data) return next(new ErrorResponse(`Chat not found!`, 404));

  data.user = user || data.user
  data.messages.push({ text });
  data.messages.push(payload);
  console.log({user, text, payload})
  await data.save()

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Delete Chat
// @route   DELTE /api/v1/chat/:id
// @access   Private/Admin
exports.deleteChat = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) return next(new ErrorResponse(`Chat Id not provided`, 400));

  const data = await Chat.findByIdAndDelete(id);
  if (!data) return next(new ErrorResponse(`Chat not found!`, 404));

  res.status(200).json({
    success: true,
    data: {},
  });
});
