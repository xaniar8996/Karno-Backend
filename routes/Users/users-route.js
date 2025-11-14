const express = require("express");
const Router = express.Router();
const { GetSingleUser, GetAllUsers } = require("../../controllers/Users/users");
const verifyJWT = require("../../middleware/verifyJWT");
const Authpage = require("../../middleware/AuthRoles");
const ROLES_LIST = require("../../config/Roles_List");

Router.get("/single-user", verifyJWT, GetSingleUser)
Router.get("/all", verifyJWT, Authpage(ROLES_LIST.Admin), GetAllUsers)

module.exports = Router