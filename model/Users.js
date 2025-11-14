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
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Moderator: Number,
        Admin: Number,
    },
    verifyOtp: {
        type: String,
        default: "",
    },
    verifyOtpExpiredAt: {
        type: Number,
        default: 0,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    resetOtp: {
        type: String,
        default: "",
    },
    resetOtpExpiredAt: {
        type: Number,
        default: 0,
    },
    refreshToken: {
        type: String,
        default: "",
    }
})

module.exports = mongoose.model("Users", UsersSchema)