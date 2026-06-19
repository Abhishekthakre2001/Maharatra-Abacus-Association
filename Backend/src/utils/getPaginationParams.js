// utils/pagination.js

const getPaginationParams = (req, defaultLimit = 5) => ({
  page: Math.max(1, Number(req.query.page) || 1),
  limit: Math.max(1, Number(req.query.limit) || defaultLimit),
  search: req.query.search?.trim() || "",
});

const buildPaginationResponse = (data, page, limit, totalRecords) => ({
  data,
  pagination: {
    page,
    limit,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
  },
});

module.exports = {
  getPaginationParams,
  buildPaginationResponse,
};
