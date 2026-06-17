const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotificationsSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["info", "success", "warning", "error"],
            default: "info",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notifications", NotificationsSchema);
