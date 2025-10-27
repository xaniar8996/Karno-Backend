
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require('dotenv').config()
const DBConnection = require("./config/DBconnection")
const CorsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 3500;

DBConnection();

app.use(express.urlencoded({ extended: false }))

app.use(cors(CorsOptions));
app.use(express.json());

app.use(express.static(path.join(__dirname, "/pubilc")));


app.use("/Register" , require("./routes/Auth/Register"));
app.use("/Login" , require("./routes/Auth/Login"));
app.use("/Refresh" , require("./routes/Refresh"));


mongoose.connection.once("open" , () => {
    console.log("Connected to mongoDB ✅");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT} 🔢`));
})