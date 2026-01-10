const QuestionModel = require("../models/QuestionModel");

const QuestionService = {
  createQuestion: (data) => QuestionModel.create(data),
  getQuestions: () => QuestionModel.findAll(),
  getQuestionsByAdmin: (adminId) => QuestionModel.findByAdmin(adminId),
  getQuestionById: (id) => QuestionModel.findById(id),
  updateQuestion: (id, data) => QuestionModel.update(id, data),
  deleteQuestion: (id) => QuestionModel.remove(id),
  bulkCreateQuestions: (questions, level, set_id, createdby,time) => QuestionModel.bulkCreate(questions, level, set_id, createdby, time)
};

module.exports = QuestionService;
