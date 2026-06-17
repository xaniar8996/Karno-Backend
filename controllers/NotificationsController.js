const Notifications = require("../model/Notifications");
const mongoose = require("mongoose");

const SendNotification = async (req, res) => {
    try {
        const { userId, title, message, type } = req.body;

        if (!userId || !title || !message) {
            return res.status(400).json({
                success: false,
                message: "userId, title و message الزامی هستند",
            });
        }

        const notification = await Notifications.create({
            userId,
            title,
            message,
            type: type || "info",
        });

        return res.status(201).json({
            success: true,
            message: "اطلاعیه با موفقیت ارسال شد",
            data: notification,
        });
    } catch (error) {
        console.error("خطا در ارسال اطلاعیه:", error);
        return res.status(500).json({
            success: false,
            message: "خطا در ارسال اطلاعیه",
            error: error.message,
        });
    }
};

const GetNotifications = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "احراز هویت الزامی است",
            });
        }

        const notifications = await Notifications.find({ userId }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            message: "اطلاعیه‌ها دریافت شدند",
            data: notifications,
        });
    } catch (error) {
        console.error("خطا در دریافت اطلاعیه‌ها:", error);
        return res.status(500).json({
            success: false,
            message: "خطا در دریافت اطلاعیه‌ها",
            error: error.message,
        });
    }
};

const GetUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId الزامی است",
            });
        }

        // Validate and convert userId to MongoDB ObjectId
        let objectUserId;
        try {
            objectUserId = new mongoose.Types.ObjectId(userId);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "userId نامعتبر است",
            });
        }

        const notifications = await Notifications.find({ userId: objectUserId }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            message: "اطلاعیه‌های کاربر دریافت شدند",
            data: notifications,
        });
    } catch (error) {
        console.error("خطا در دریافت اطلاعیه‌های کاربر:", error);
        return res.status(500).json({
            success: false,
            message: "خطا در دریافت اطلاعیه‌ها",
            error: error.message,
        });
    }
};

const MarkAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body;

        if (!notificationId) {
            return res.status(400).json({
                success: false,
                message: "notificationId الزامی است",
            });
        }

        // Validate and convert notificationId to MongoDB ObjectId
        let objectNotificationId;
        try {
            objectNotificationId = new mongoose.Types.ObjectId(notificationId);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "notificationId نامعتبر است",
            });
        }

        const notification = await Notifications.findByIdAndUpdate(
            objectNotificationId,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "اطلاعیه یافت نشد",
            });
        }

        return res.status(200).json({
            success: true,
            message: "اطلاعیه به‌عنوان خوانده شده علامت‌گذاری شد",
            data: notification,
        });
    } catch (error) {
        console.error("خطا در علامت‌گذاری اطلاعیه:", error);
        return res.status(500).json({
            success: false,
            message: "خطا در علامت‌گذاری اطلاعیه",
            error: error.message,
        });
    }
};

module.exports = {
    SendNotification,
    GetNotifications,
    GetUserNotifications,
    MarkAsRead,
};
