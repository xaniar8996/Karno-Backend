const express = require("express");
const Router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");
const {
    SendNotification,
    GetNotifications,
    GetUserNotifications,
    MarkAsRead,
} = require("../../controllers/NotificationsController");

Router.post("/sendNotification", verifyJWT, SendNotification);
Router.get("/get-notifications", verifyJWT, GetNotifications);
Router.get("/get-notifications/:userId", verifyJWT, GetUserNotifications);
Router.put("/mark-as-read", verifyJWT, MarkAsRead);

module.exports = Router;
