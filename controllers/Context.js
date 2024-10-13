// const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Context = require("../models/Context");
const { updateMetaData } = require("../utils/utils");
const { audit } = require("../utils/auditUtils");
const { extractFileContent } = require("../utils/contextUtils");

// @desc    Create Context/
// @route   POST  /api/v1/context/
// @access   Public
exports.createContext = asyncHandler(async (req, res, next) => {
  updateMetaData(req.body, req.user?._id);

  // console.log({ body: req.body });

  let contextText = req.body.context;
  if (req.files) {
    for (const file of Object.values(req.files)) {
      const extractedContent = await extractFileContent(file);
      contextText += extractedContent.text;
      contextText += extractedContent.images;
    }
  }

  console.log({ contextText });

  req.body.context = contextText;

  const [data] = [
    await Context.create(req.body),
    await audit.create(req.user, "Context"),
  ];

  if (!data) return next(new ErrorResponse(`Context not found!`, 404));

  res.status(201).json({
    success: true,
    contextText,
    data,
  });
});

// @desc    Get All Context
// @route   POST  /api/v1/context/
// @access   Private/Admin
exports.getContexts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get Single Context
// @route   GET /api/v1/context/:id
// @access   Private/Admin
exports.getContext = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) return next(new ErrorResponse(`Context Id not provided`, 400));

  let data = await Context.findById(id);
  if (!data) return next(new ErrorResponse(`Context not found!`, 404));

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Update Context
// @route   PATCH api/v1/context/:id
// @access   Private
exports.updateContext = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) return next(new ErrorResponse(`Context Id not provided`, 400));

  let contextText = req.body.context;
  if (req.files) {
    for (const file of Object.values(req.files)) {
      const extractedContent = await extractFileContent(file);
      contextText += extractedContent.text;
      contextText += extractedContent.images;
    }
  }

  console.log({ contextText });

  req.body.context = contextText;
  const [data] = [
    await Context.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }),
  ];
  await audit.update(req.user, "Context", data?._id);

  if (!data) return next(new ErrorResponse(`Context not found!`, 404));

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Delete Context
// @route   DELTE /api/v1/context/:id
// @access   Private/Admin
exports.deleteContext = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) return next(new ErrorResponse(`Context Id not provided`, 400));

  const [data] = [await Context.findByIdAndDelete(id)];
  await audit.delete(req.user, "Context", data?._id);

  if (!data) return next(new ErrorResponse(`Context not found!`, 404));

  res.status(200).json({
    success: true,
    data: {},
  });
});
