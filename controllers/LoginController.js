const bcrypt = require("bcrypt");
const Users = require("../model/Users");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const HandleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required !" })
        };

        const Founduser = await Users.findOne({ email });

        if (!Founduser) return res.status(409).json({ message: "User doesn't exit !" });

        const ComparePass = await bcrypt.compare(password, Founduser.password);

        if (!ComparePass) {
            return res.status(401).json({ message: "Incorrect password!" });
        }

        const tokenPayload = {
            userId: Founduser._id,
            email: Founduser.email
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

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            // sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
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
        console.error("❌ Login error ❌:", error);
        return res.status(500).json({ message: "Internal server error" });
    }


}

module.exports =  HandleLogin 