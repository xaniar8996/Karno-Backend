const jwt = require("jsonwebtoken");
const Users = require("../model/Users");

// Constants
const ACCESS_TOKEN_EXPIRY = "15m";

const HandleRefreshToken = async (req, res) => {
    try {
        // Extract refresh token from cookies
        const refreshToken = req.cookies?.jwt;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found"
            });
        }

        // Verify token before database query
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        } catch (err) {
            return res.status(403).json({
                message: "Invalid or expired refresh token"
            });
        }

        // Find user by refresh token (await was missing!)
        const foundUser = await Users.findOne({ refreshToken });

        if (!foundUser) {
            return res.status(403).json({
                message: "Refresh token not associated with any user"
            });
        }

        // Verify email matches
        if (foundUser.email !== decoded.email) {
            return res.status(403).json({
                message: "Token mismatch"
            });
        }

        // Generate new access token
        const accessToken = jwt.sign(
            {
                id: foundUser._id,
                email: foundUser.email,
                roles: foundUser.roles 
            },
            process.env.ACCESS_TOKEN,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        // Optionally rotate refresh token for better security
        
        // const newRefreshToken = jwt.sign(
        //     {
        //         id: foundUser._id,
        //         email: foundUser.email
        //     },
        //     process.env.REFRESH_TOKEN,
        //     { expiresIn: "7d" }
        // );

        // // Update refresh token in database

        // foundUser.refreshToken = newRefreshToken;
        // await foundUser.save();

        // // Set new refresh token cookie
        // res.cookie("jwt", newRefreshToken, {
        //     httpOnly: true,
        //     // secure: process.env.NODE_ENV === "production",
        //     // sameSite: "strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000
        // });

        return res.status(200).json({
            accessToken,
            message: "Token refreshed successfully"
        });

    } catch (error) {
        console.error("Refresh token error:", error);
        return res.status(500).json({
            message: "An error occurred while refreshing token"
        });
    }
};

module.exports =  HandleRefreshToken 