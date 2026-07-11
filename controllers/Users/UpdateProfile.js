const Users = require("../../model/Users");
const logger = require("../../config/logger");

const ALLOWED_FIELDS = ["Fullname", "email"];

const EditUser = async (req, res) => {
  const userId = req.userId;

  try {
    const updates = {};

    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "هیچ فیلدی برای بروزرسانی ارسال نشده.",
      });
    }

    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!emailRegex.test(updates.email)) {
          return res.status(409).json({
              success: false,
              message: "Email is not valid"
          });
      }
  }

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...updates,
          ...(updates.email && { isAccountVerified: false }),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    logger.info({
      event: "USER_UPDATED",
      updatedFields: Object.keys(updates),
      userId,
      ip: req.ip,
    });

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    logger.error({
      event: "USER_UPDATE_FAILED",
      message: error.message,
      stack: error.stack,
      ip: req.ip,
    });

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = EditUser;
