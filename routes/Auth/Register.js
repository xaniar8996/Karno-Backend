const express = require("express");
const Router = express.Router();
const HandleRegister = require("../../controllers/RegisterController");

Router.post("/" , HandleRegister)

module.exports = Router