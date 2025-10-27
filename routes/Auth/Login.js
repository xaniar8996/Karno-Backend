const express = require("express");
const Router = express.Router();
const HandleLogin = require("../../controllers/LoginController")

Router.post("/" , HandleLogin)

module.exports = Router