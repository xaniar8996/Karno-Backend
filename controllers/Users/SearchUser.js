const logger = require("../../config/logger");
const Users = require("../../model/Users");

const SearchUsers = async (req, res) => {
  const userId = req.userId;
  const { query } = req.params;

  try {

    if(!query) return res.status(400).json({success:false , message:"ًQuery is required !"})

    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "userId is required !" });

    const usersResponse = await Users.find({
      $text: {
        $search: query,
      },
    }).select("-password -refreshToken -verificationCode").limit(20);

    logger.info({
      event: "USER_FOUND",
      currentUserId: userId,
      searchQuery: query,
      ip: req.ip,
    });

    return res.status(200).json({
        success:true,
        message:"User is found successfully",
        data:usersResponse
    })

  } catch (error) {
    logger.error({
      event: "USER_FOUNDFAILED",
      message: error.message,
      stack: error.stack,
      ip: req.ip,
    });

    return res.status(500).json({
        success:false,
        message:"Internal server error"
      });
      
  }
};

module.exports = SearchUsers;
