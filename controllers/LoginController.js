const bcrypt = require("bcrypt");
const Users = require("../model/Users");
const transporter = require("../config/nodemailer")
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
require("dotenv").config();


const HandleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required !" })
        };

        const normalizedEmail = String(email).toLowerCase();

        const Founduser = await Users.findOne({ email: normalizedEmail });

        if (!Founduser) {
            // Generic response to avoid user enumeration
            return res.status(404).json({ message: "User Not found" });
        }

        const ComparePass = await bcrypt.compare(password, Founduser.password);

        if (!ComparePass) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const tokenPayload = {
            id: Founduser._id,
            email: Founduser.email,
            roles: Founduser.roles 
        };

        const accessToken = jwt.sign(
            tokenPayload,
            process.env.ACCESS_TOKEN,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            tokenPayload,
            process.env.REFRESH_TOKEN,
            { expiresIn: "7d" }
        );

        Founduser.refreshToken = refreshToken
        await Founduser.save();

        // Set refresh token cookie with secure flag in production
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const mailOptions = {
            from: "کارنو",
            to: email,
            subject: "به کارنو خوش اومدی",
            text: "خیلی ممنونیم ازت که کارنو رو انتخاب کردی . با رزومه های کارنو همه جا قبول میشی",
            html: `
             <div dir="rtl" style="font-family: Tahoma;">
            <h2>به کارنو خوش اومدی! 🎉</h2>
            <p>خیلی ممنونیم ازت که کارنو رو انتخاب کردی.</p>
            <p>با رزومه‌های کارنو همه جا قبول میشی 💼</p>
        </div>
            `
        };

        // Don't await - send in background
        transporter.sendMail(mailOptions).then(() => {
            console.log("Email send successfully 📨✅");
        })
            .catch(err => {
                console.error("❌ Email sending failed:", err.message);
            });

        console.log(`user logged in successfully with email ${email} ✔️`);

        logger.info({
            event:"USER_LOGGED_IN",
            userId: Founduser._id,
            email: Founduser.email,
            Fullname:Founduser.Fullname,
            ip: req.ip,
        });

        return res.status(200).json({
            message: `User ${email} logged in successfully ✅`,
            accessToken,
            user: {
                id: Founduser._id,
                email: Founduser.email
            }
        });

    } catch (error) {
        logger.error({
            event: "USER_LOGGED_IN_FAILED",
            message: error.message,
            stack: error.stack,
            ip: req.ip,
         });


        console.error("❌ Login error ❌:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

  


module.exports = HandleLogin 