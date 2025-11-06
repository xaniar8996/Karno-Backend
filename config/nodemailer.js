const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "x655454@Gmail.com",
    pass: "xajifmzlpgksgqur"
  }
});

module.exports = transporter