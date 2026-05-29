const { GoogleGenerativeAI } = require("@google/generative-ai");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = genAI;
