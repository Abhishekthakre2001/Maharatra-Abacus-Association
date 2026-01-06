const QuestionModel = require("../models/QuestionModel");

const QuestionService = {
  createQuestion: (data) => QuestionModel.create(data),
  getQuestions: () => QuestionModel.findAll(),
  getQuestionById: (id) => QuestionModel.findById(id),
  updateQuestion: (id, data) => QuestionModel.update(id, data),
  deleteQuestion: (id) => QuestionModel.remove(id)
  ,
  bulkCreateQuestions: (questions, level, set_id, createdby) => QuestionModel.bulkCreate(questions, level, set_id, createdby)
};

module.exports = QuestionService;
