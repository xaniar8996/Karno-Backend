const { searchUsersRepo } = require("../repositories/user.repository");

const searchUsersService = async (filters) => {
  const parsedFilters = {
    ...filters,
    page: Math.max(Number(filters.page) || 1, 1),
    limit: Math.max(Number(filters.limit) || 10, 1),
    search: filters.search || filters.query,
  };

  const users = await searchUsersRepo(parsedFilters);

  return {
    users: users.data,

    pagination: {
      page: parsedFilters.page,
      limit: parsedFilters.limit,
      total: users.total,
    },
  };
};

module.exports = {
  searchUsersService,
};
