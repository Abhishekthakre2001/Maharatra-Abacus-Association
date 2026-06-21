const ExamResultModel = require("../models/ExamResultModel");
const ResultModel = require("../models/ResultModel");

const resultService = {
  getResultByAdminId: (id, page, limit, search) =>
    ResultModel.findResultByAdminId(id, page, limit, search),
  getExamResultByAdminId: (admin_id, page, limit, search) =>
    ExamResultModel.findExamResultByAdminId(admin_id, page, limit, search),
  exportExamResultByAdminId: (admin_id) =>
    ExamResultModel.exportExamResultByAdminId(admin_id),
};

module.exports = resultService;
