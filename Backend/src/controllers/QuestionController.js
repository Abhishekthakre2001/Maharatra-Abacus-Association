const QuestionService = require("../services/QuestionService");

exports.createQuestion = async (req, res) => {
  const result = await QuestionService.createQuestion(req.body);
  res.status(201).json({ success: true, id: result.insertId });
};

exports.getQuestions = async (req, res) => {
  const data = await QuestionService.getQuestions();
  res.json(data);
};

exports.getQuestionById = async (req, res) => {
  const data = await QuestionService.getQuestionById(req.params.id);
  res.json(data);
};

exports.updateQuestion = async (req, res) => {
  await QuestionService.updateQuestion(req.params.id, req.body);
  res.json({ success: true });
};

exports.deleteQuestion = async (req, res) => {
  await QuestionService.deleteQuestion(req.params.id);
  res.json({ success: true });
};
