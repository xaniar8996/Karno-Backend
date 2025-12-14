
    const express = require("express");
    const Router = express.Router();
    const Logout = require("../../controllers/LogoutController");
    const verifyJWT = require("../../middleware/verifyJWT");

    Router.post("/" , verifyJWT , Logout)

    module.exports = Router