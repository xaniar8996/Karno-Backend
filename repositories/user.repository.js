const ROLES_LIST = require("../config/Roles_List");
const Users = require("../model/Users");

const searchUsersRepo = async (filters) => {
  const { search, role, page, limit, sort } = filters;
  
  const query = {};
  
  // Search
  if (search) {
    query.$or = [
      {
        Fullname: {
          $regex: search,
          $options: "i",
        },
      },

      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // Filter Role

  if (role) {
    query[`roles.${role}`] = ROLES_LIST[role];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Users.find(query)
      .select("-password -refreshToken")
      .sort(sort === "newest" ? { createdAt: -1 } : { createdAt: 1 })
      .skip(skip)
      .limit(limit),

    Users.countDocuments(query),
  ]);

  return {
    data,
    total,
  };
};

module.exports = {
  searchUsersRepo,
};
