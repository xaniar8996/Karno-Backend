const bcrypt = require("bcrypt");
const Users = require("../model/Users");
const logger = require("../config/logger");

const HandleRegister = async (req, res) => {
    try {
        const { Fullname, email, password } = req.body;

        if (!Fullname || !email || !password) {
            return res.status(400).json({ message: "Fullname , email and password are required !" })
        };

        // Basic password policy
        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const normalizedEmail = String(email).toLowerCase();

        const Founduser = await Users.findOne({ email: normalizedEmail }).exec();

        if (Founduser) return res.status(409).json({ success: false, message: "user is already exist !" });
41523
        const hashedPass = await bcrypt.hash(password, 10);

        const RegisterUser = await Users.create({
            Fullname: Fullname,
            email: normalizedEmail,
            password: hashedPass,
        });

        logger.info({
            event: "USER_REGISTER",
            userId: RegisterUser._id,
            fullname: RegisterUser.Fullname,
            email: RegisterUser.email,
            ip: req.ip,
        });

        if (RegisterUser) {
            res.status(201).json({ message: `User ${Fullname} Registered Successfully` });
        }

    } catch (error) {
        logger.error({
            event: "USER_REGISTER_FAILED",
            message: error.message,
            stack: error.stack,
            ip: req.ip,
         });
         
        console.error("❌ Registration error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }


}

module.exports = HandleRegister 