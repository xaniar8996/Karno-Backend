
const express = require("express");
const Router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");
const upload = require("../../middleware/upload");
const { AddCV, FetchUserCV, UpdateCV, FetchAllCVs, GetCVById, DeleteCV } = require("../../controllers/CvController/CV");
const DuplicateCV = require("../../controllers/CvController/Duplicate");

Router.post("/create", verifyJWT, upload.single("photo"), AddCV);
Router.get("/userCv" , verifyJWT , FetchUserCV);
Router.put("/:id", verifyJWT, upload.single("photo"), UpdateCV);
Router.get("/all", verifyJWT, FetchAllCVs);
Router.get("/:id", verifyJWT, GetCVById);
Router.delete("/:id", verifyJWT, DeleteCV);
Router.post("/copy/:id" , verifyJWT , DuplicateCV)

module.exports = Router