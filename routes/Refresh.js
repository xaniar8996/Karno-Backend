const express = require("express");
const Router = express.Router();
const HandleRefreshToken = require("../controllers/RefreshTokenController")

Router.get("/" , HandleRefreshToken)

module.exports = Router