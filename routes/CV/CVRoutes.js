
const express = require("express");
const Router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");
const upload = require("../../middleware/upload");
const { AddCV, FetchUserCV, UpdateCV } = require("../../controllers/CvController/CV");

Router.post("/create", verifyJWT, upload.single("photo"), AddCV);
Router.get("/userCv" , verifyJWT , FetchUserCV);
Router.put("/:id", verifyJWT, upload.single("photo"), UpdateCV);

module.exports = Router