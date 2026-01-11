const QuestionModel = require("../models/QuestionModel");

const QuestionService = {
  createQuestion: (data) => QuestionModel.create(data),
  getQuestions: () => QuestionModel.findAll(),
 getSetsByLevelAndCreator: ({ level, createdby }) => QuestionModel.getSetsByLevelAndCreator({ level, createdby }),
  getQuestionsByAdmin: (adminId) => QuestionModel.findByAdmin(adminId),
  getQuestionById: (id) => QuestionModel.findById(id),
  updateQuestion: (id, data) => QuestionModel.update(id, data),
  updateSet: (data) => QuestionModel.updateSet(data),
  deleteQuestion: (id) => QuestionModel.remove(id),
  deleteSet: (level, set_id) => QuestionModel.removeSet(level, set_id),
  bulkCreateQuestions: (questions, level, set_id, createdby, time, ismockset) => QuestionModel.bulkCreate(questions, level, set_id, createdby, time, ismockset)
};

module.exports = QuestionService;
