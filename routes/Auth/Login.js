const express = require("express");
const Router = express.Router();
const HandleLogin = require("../../controllers/LoginController")
const { loginLimiter } = require("../../middleware/rateLimit");
const { body, validationResult } = require("express-validator");

const validateLogin = [
	body("email").isEmail().normalizeEmail(),
	body("password").isLength({ min: 1 }),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		next();
	},
];

Router.post("/", loginLimiter, validateLogin, HandleLogin)

module.exports = Router