const express = require("express");
const Router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");
const { sendVerifyOTP, verifyEmail, sendResetPasswordOTP, ResetPassword, verifyResetPasswordOTP } = require("../../controllers/OTPsController");
const { otpLimiter } = require("../../middleware/rateLimit");

Router.post("/send-otp", verifyJWT, sendVerifyOTP);
Router.post("/verify-account", verifyJWT, verifyEmail);
Router.post("/reset-otp", otpLimiter, sendResetPasswordOTP);
Router.post("/verify-reset-otp", otpLimiter, verifyResetPasswordOTP);
Router.post("/reset-password", otpLimiter, ResetPassword);

module.exports = Router;