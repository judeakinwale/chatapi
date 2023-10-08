// const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Chat = require("../models/Chat");
const { updateMetaData } = require("../utils/utils");
const {
  getResponseAI,
  // getResponseOpenAI,
  getChatResponseAI,
} = require("../utils/chatUtils");
const { audit } = require("../utils/auditUtils");

// @desc    Create Chat/
// @route   POST  /api/v1/chat/
// @access   Public
exports.createChat = asyncHandler(async (req, res, next) => {
  updateMetaData(req.body, req.user?._id);
  req.body.user = req.body.user || req.user?._id;

  const { user = req.user?._id, text } = req.body;
  if (!text) return next(new ErrorResponse(`Please enter a question!`, 400));

  // const openaiResponse = await getResponseOpenAI()
  // console.log({ openaiResponse });

  const timestamp = new Date();

  const prompt = [{ role: "user", content: text }];
  const response = await getChatResponseAI(prompt, req);

  // const response = await getResponseAI(text, req);
  const payload = { text: response, sender: "bot" };
  console.log({ response });

  const data = await Chat.create(req.body);
  if (!data) return next(new ErrorResponse(`Chat not found!`, 400));

  data.user = user || data.user;
  data.messages.push({ text, timestamp });
  data.messages.push(payload);
  // console.log({ user, text, payload });
  await data.save();

  await audit.create(req.user, "Chat");
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
// @route   PATCH api/v1/chat
// @access   Private
exports.updateChat = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) console.log(`Chat Id not provided`);
  // if (!id) return next(new ErrorResponse(`Chat Id not provided`, 400));

  const { user = req.user?._id, text } = req.body;
  if (!text) return next(new ErrorResponse(`Please enter a question!`, 400));

  // const data = await Chat.findById(id);

  const data = id ? await Chat.findById(id) : await Chat.create(req.body);
  if (!data) return next(new ErrorResponse(`Chat not found!`, 404));

  const timestamp = new Date();

  const previousPrompts = formattedPreviousPrompts(data.messages);
  const prompt = [...previousPrompts, { role: "user", content: text }];
  console.log({prompt})
  const response = await getChatResponseAI(prompt, req);

  // const response = await getResponseAI(text, req);
  const payload = { text: response, sender: "bot" };

  data.user = user || data.user;
  data.messages.push({ text, timestamp });
  data.messages.push(payload);
  // console.log({ user, text, payload });
  await data.save();

  await audit.update(req.user, "Chat", data?._id);
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

  await audit.delete(req.user, "Chat", data?._id);
  res.status(200).json({
    success: true,
    data: {},
  });
});

// format chat messages to prompts for context (previous prompts)
function formattedPreviousPrompts(messages = [], historyCount = 4) {
  // ? this should improve the performance 
  // TODO: test this
  // set previous messages to only the messages sent by the user
  let prevMsg = messages.filter(m => m.sender == "user")  // not modifying messages

  // convert messages within history count to prompts
  if (prevMsg.length > historyCount) prevMsg = prevMsg.slice(-historyCount);

  const formattedMessages = messages.map((m) => ({
    role: m.sender == "bot" ? "assistant" : "user",
    content: m.text,
  }));
  return formattedMessages;
}
