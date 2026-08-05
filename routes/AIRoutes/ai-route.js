const express = require("express");
const  TextSummary  = require("../../controllers/AI/TextSummary");
const verifyJWT = require("../../middleware/verifyJWT");
const { aiLimiter } = require("../../middleware/rateLimit");
const Router = express.Router();

Router.post("/text-summary", verifyJWT, aiLimiter, TextSummary);

module.exports = Router;