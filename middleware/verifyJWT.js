const jwt = require("jsonwebtoken")

const verifyJWT = async (req, res, next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized, login again (header part)"
        });
    }

    try {
        const token = authHeader.split(' ')[1];

        const tokenDecoded = jwt.verify(token, process.env.ACCESS_TOKEN);

        // Ensure req.body exists before setting id
        if (!req.body) {
            req.body = {};
        }
        req.body.id = tokenDecoded.id;
        req.userId = tokenDecoded.id;
        req.roles = tokenDecoded.roles; 
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized, login again (catch part)",
            error: error.message
        });
    }
}

module.exports = verifyJWT