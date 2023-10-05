const { connectAI } = require("../config/chat");

const aiClient = async (req, res, next) => {
  
  req.aiClient = await connectAI();

  next();
};

module.exports = aiClient;
