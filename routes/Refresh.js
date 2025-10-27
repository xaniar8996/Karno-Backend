const express = require("express");
const Router = express.Router();
const HandleRefreshToken = require("../controllers/RefreshTokenController")

Router.post("/" , HandleRefreshToken)

module.exports = Router