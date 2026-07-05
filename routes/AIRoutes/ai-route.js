const express = require("express");
const  TextSummary  = require("../../controllers/AI/TextSummary");
const verifyJWT = require("../../middleware/verifyJWT");
const Router = express.Router();

Router.post("/text-summary", verifyJWT, TextSummary);

module.exports = Router;