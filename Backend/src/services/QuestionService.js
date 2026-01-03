const QuestionModel = require("../models/QuestionModel");

const QuestionService = {
  createQuestion: (data) => QuestionModel.create(data),
  getQuestions: () => QuestionModel.findAll(),
  getQuestionById: (id) => QuestionModel.findById(id),
  updateQuestion: (id, data) => QuestionModel.update(id, data),
  deleteQuestion: (id) => QuestionModel.remove(id)
};

module.exports = QuestionService;
