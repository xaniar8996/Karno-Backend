
const logger = require("../config/logger");
const Users = require("../model/Users");

// Assumes verifyJWT middleware has already attached user id to req.userId
const Logout = async (req, res) => {
    // Prefer id from JWT; allow explicit id in body as a fallback
    const userId = req.userId || req.body?.id;

    if (!userId) {
        return res.status(400).json({ message: "user id is required !" });
    }

    try {
        const user = await Users.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found !" });
        }

        // Invalidate refresh token in DB
        user.refreshToken = "";
        await user.save();

        // Clear refresh token cookie (adjust cookie name if different)
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            path: "/", 
        });

        logger.info({
            event:"USER_LOGGED_OUT",
            userId: user._id,
            email: user.email,
            Fullname:user.Fullname,
            ip: req.ip,
        });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        logger.error({
            event: "USER_LOGGED_OUT_FAILED",
            message: error.message,
            stack: error.stack,
            ip: req.ip,
         });

        console.error("Logout error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = Logout;