const express = require("express");
const Router = express.Router();
const GetSingleUser = require("../../controllers/Users/SingleUser");
const verifyJWT = require("../../middleware/verifyJWT");

Router.get("/single-user" , verifyJWT, GetSingleUser)

module.exports = Router