const logger = require("../config/logger");
const transporter = require("../config/nodemailer");
const { getContactUsData } = require("../config/emailTemplates");

const ContactUsController = async (req, res) => {
  try {
    const { Fullname, email, subject, message } = req.body;

    if (!Fullname?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Missing data!" });
    }

    // Basic HTML tag stripping to reduce injection risk
    const stripTags = (s = "") => String(s).replace(/<[^>]*>?/gm, "").trim();

    const sanitizedFullname = stripTags(Fullname);
    const sanitizedEmail = String(email).trim().toLowerCase();
    const sanitizedSubject = stripTags(subject).replace(/[\r\n]/g, " ");
    const sanitizedMessage = stripTags(message);

    const mailOptions = {
      from: `"فرم تماس با ما" <${process.env.SMTP_USER || "noreply@xanitech.ir"}>`,
      to: "xanitech.ir@gmail.com",
      replyTo: sanitizedEmail,
      subject: `[تماس با ما] ${sanitizedSubject}`,
      html: getContactUsData(sanitizedFullname, sanitizedEmail, sanitizedSubject, sanitizedMessage),
    };

    await transporter.sendMail(mailOptions);

    logger.info({
      event: "MESSAGE_SENT_SUCCESSFULLY",
      Fullname,
      email,
      subject: sanitizedSubject,
      ip: req.ip,
    });

    return res
      .status(200)
      .json({ success: true, message: "Message is sent successfully" });

  } catch (error) {
    logger.error({
      event: "FAILED_SENDING_MESSAGE",
      error: error.message,
      stack: error.stack,
      ip: req.ip,
    });

    return res
      .status(500)
      .json({
        success: false,
        message:
          error?.message || "Failed with sending message , please try again !",
      });
  }
};

module.exports = ContactUsController;