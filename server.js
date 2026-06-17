
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
require('dotenv').config()
const DBConnection = require("./config/DBconnection")
const CorsOptions = require("./config/corsOptions");
const rateLimit = require("./middleware/rateLimit");
const PORT = process.env.PORT || 3500;

DBConnection();

app.use(express.urlencoded({ extended: false }))

app.use(cors(CorsOptions));

app.use(express.json());
app.use(cookieParser())

app.use(express.static(path.join(__dirname, "/pubilc")));

app.use(rateLimit);

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
// logout
app.use("/logout" , require("./routes/Auth/logout"));


mongoose.connection.once("open" , () => {
    console.log("Connected to mongoDB ✅");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT} 🔢`));
})