const express = require("express");
const Router = express.Router();
const { GetSingleUser, GetAllUsers, DeleteUser, UpdateUser } = require("../../controllers/Users/users");
const verifyJWT = require("../../middleware/verifyJWT");
const Authpage = require("../../middleware/AuthRoles");
const ROLES_LIST = require("../../config/Roles_List");
const EditUser = require("../../controllers/Users/UpdateProfile");
const SearchUsers = require("../../controllers/Users/SearchUser");

Router.get("/single-user", verifyJWT, GetSingleUser)
Router.get("/all", verifyJWT, Authpage(ROLES_LIST.Admin), GetAllUsers)
Router.delete("/delete", verifyJWT, Authpage(ROLES_LIST.Admin), DeleteUser)
Router.put("/update", verifyJWT, Authpage(ROLES_LIST.Admin,ROLES_LIST.Moderator), UpdateUser)
Router.patch("/edit-profile", verifyJWT, EditUser);
Router.get("/search-user/:query", verifyJWT,Authpage(ROLES_LIST.Admin , ROLES_LIST.Moderator), SearchUsers);

module.exports = Router