
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
require('dotenv').config()
const DBConnection = require("./config/DBconnection")
const CorsOptions = require("./config/corsOptions");
const rateLimiters = require("./middleware/rateLimit");
const sanitizeObject = require("./middleware/sanitizeObject")
const PORT = process.env.PORT || 3500;

DBConnection();

// Security middlewares
app.set("trust proxy", 1);
app.use(helmet());
app.use(hpp());

app.use((req, res, next) => {
    try {
        // Sanitize body and params (these are normally writable)
        sanitizeObject(req.body);
        sanitizeObject(req.params);
        // Try to sanitize query but guard against read-only getters
        try {
            sanitizeObject(req.query);
        } catch (e) {
            // Some frameworks expose a getter-only req.query; ignore errors
        }
    } catch (e) {
        console.error('Sanitization middleware error:', e);
    }
    next();
});

app.use(express.urlencoded({ extended: false }));
app.use(cors(CorsOptions));

app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, "/public")));

// Rate limiter (global) - keep but also use endpoint-specific limits
app.use(rateLimiters.globalLimiter);

// Auth routes
app.use("/Register" , require("./routes/Auth/Register"));
app.use("/Login" , require("./routes/Auth/Login"));
app.use("/otp" , require("./routes/Auth/OTP-route"));
app.use("/Refresh" , require("./routes/Refresh"));
// home routes
app.use("/users" , require("./routes/Users/users-route"));
// CV routes
app.use("/cv" , require("./routes/CV/CVRoutes"));
// Notifications routes
app.use("/notifications" , require("./routes/Notifications/NotificationsRoutes"));
// AI routes
app.use("/ai" , require("./routes/AIRoutes/ai-route"));
// admin
app.use("/admin" , require("./routes/AdminRoutes/userSearchRoute"));
// Contact Us
app.use("/contact-us" , require("./routes/ContactUsRoute"));
// logout
app.use("/logout" , require("./routes/Auth/logout"));


mongoose.connection.once("open" , () => {
    console.log("Connected to mongoDB ✅");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT} 🔢`));
})