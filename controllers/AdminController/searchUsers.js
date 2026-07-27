const { searchUsersService } = require("../../services/user.service");

const searchUsers = async (req, res) => {
  const filters = {
    ...req.query,
    search: req.query.search || req.query.query,
  };

  try {
    const result = await searchUsersService(filters);

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = {
  searchUsers,
};
