const express = require("express");
const Router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");
const { sendVerifyOTP, verifyEmail, sendResetPasswordOTP, ResetPassword, verifyResetPasswordOTP } = require("../../controllers/OTPsController");

Router.post("/send-otp", verifyJWT, sendVerifyOTP);
Router.post("/verify-account", verifyJWT, verifyEmail);
Router.post("/reset-otp", sendResetPasswordOTP);
Router.post("/verify-reset-otp", verifyResetPasswordOTP);
Router.post("/reset-password", ResetPassword);

module.exports = Router;