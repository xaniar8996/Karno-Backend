const express = require("express");
const verifyJWT = require("../../middleware/verifyJWT");
const Authpage = require("../../middleware/AuthRoles");
const ROLES_LIST = require("../../config/Roles_List");
const {
  searchUsers,
} = require("../../controllers/AdminController/searchUsers");
const Router = express.Router();

Router.get(
  "/user-search",
  verifyJWT,
  Authpage(ROLES_LIST.Admin, ROLES_LIST.Moderator),
  searchUsers,
);

module.exports = Router;
