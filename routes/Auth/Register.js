const express = require("express");
const Router = express.Router();
const HandleRegister = require("../../controllers/RegisterController");
const { registerLimiter } = require("../../middleware/rateLimit");
const { body, validationResult } = require("express-validator");

const validateRegister = [
	body("Fullname").isLength({ min: 1 }).trim().escape(),
	body("email").isEmail().normalizeEmail(),
	body("password").isLength({ min: 8 }),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		next();
	},
];

Router.post("/", registerLimiter, validateRegister, HandleRegister)

module.exports = Router