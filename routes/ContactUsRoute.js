const express = require("express");
const ContactUsController = require("../controllers/ContactUsController");
const Router = express.Router();
const Authpage = require("../middleware/AuthRoles");
const ROLES_LIST = require("../config/Roles_List");
const verifyJWT = require("../middleware/verifyJWT");

Router.post("/", ContactUsController);

module.exports = Router