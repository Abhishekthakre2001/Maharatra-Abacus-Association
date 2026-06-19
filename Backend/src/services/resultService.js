const ExamResultModel = require("../models/ExamResultModel");
const ResultModel = require("../models/ResultModel");

const resultService = {
  getResultByAdminId: (id, page, limit, search) =>
    ResultModel.findResultByAdminId(id, page, limit, search),
  getExamResultByAdminId: (admin_id, page, limit, search) =>
    ExamResultModel.findExamResultByAdminId(admin_id, page, limit, search),
};

module.exports = resultService;
