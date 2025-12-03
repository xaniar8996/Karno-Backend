
const express = require("express");
const Router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");
const {AddCV} = require("../../controllers/CvController/CV");

Router.post("/create", verifyJWT, AddCV);

module.exports = Router