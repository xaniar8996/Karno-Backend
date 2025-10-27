const mongoose = require("mongoose");
const { Schema } = mongoose;

const UsersSchema = new Schema({
    Fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Users", UsersSchema)