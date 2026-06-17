
const Users = require("../model/Users");
const transporter = require("../config/nodemailer");
const bcrypt = require("bcrypt");
const { getVerifyOTPTemplate, getResetPasswordOTPTemplate } = require("../config/emailTemplates");

const sendVerifyOTP = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is required !" });
        }

        const user = await Users.findById(id);

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found !" });
        }

        if (user.isAccountVerified) {
            return res.status(404).json({ success: false, message: "Account is verified Already !" })
        }

        const OTP = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = OTP
        user.verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: "کارنو",
            to: user.email,
            subject: "OTP شما ارسال شد ✅",
            html: getVerifyOTPTemplate(OTP)
        };

        // Don't await - send in background
        transporter.sendMail(mailOptions)

        res.status(200).json({ success: true, message: "OTP send to email successfully !" })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const verifyEmail = async (req, res) => {
    const { id, OTP } = req.body;

    if (!id || !OTP) {
        return res.status(400).json({ success: false, message: "Missing Details !" })
    };

    try {
        const user = await Users.findById(id);

        if (!user) return res.status(404).json({ success: false, message: "User not found !" });

        if (user.verifyOtp === "" || user.verifyOtp !== OTP) return res.status(401).json({ success: false, message: "Invalid OTP" });

        if (user.verifyOtpExpiredAt < Date.now()) return res.status(410).json({ success: false, message: "OTP Expired" })

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpiredAt = 0

        await user.save();

        return res.status(200).json({ success: true, message: "Email verified successfully ✅✅" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const sendResetPasswordOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ success: false, message: "Email is required !" });

    try {

        const user = await Users.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: "User not found !" });

        const OTP = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = OTP
        user.resetOtpExpiredAt = Date.now() + 15 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: "کارنو",
            to: user.email,
            subject: "OTP شما ارسال شد ✅",
            html: getResetPasswordOTPTemplate(OTP)
        };

        // Don't await - send in background
        transporter.sendMail(mailOptions)

        res.status(200).json({ success: true, message: "Reset Password OTP send to email successfully !" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const verifyResetPasswordOTP = async (req, res) => {
    const { email, OTP } = req.body;

    if (!email || !OTP) return res.status(400).json({ success: false, message: "Missing Details !" });

    try {
        const user = await Users.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: "User not found !" });

        if (user.resetOtp === "" || user.resetOtp !== OTP) return res.status(400).json({ success: false, message: "Invalid OTP" });

        if (user.resetOtpExpiredAt < Date.now()) return res.status(400).json({ success: false, message: "OTP Expired" });

        return res.status(200).json({ success: true, message: "OTP verified successfully ✅" })

    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

const ResetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) return res.status(400).json({ success: false, message: "Missing Details !" });

    try {
        const user = await Users.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: "User not found !" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpiredAt = 0;
        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successfully !" })

    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

module.exports = { verifyEmail, sendVerifyOTP, sendResetPasswordOTP, verifyResetPasswordOTP, ResetPassword }