const QuestionService = require("../services/QuestionService");

exports.createQuestion = async (req, res) => {
  const result = await QuestionService.createQuestion(req.body);
  res.status(201).json({ success: true, id: result.insertId });
};

// Bulk create questions from CSV/array
exports.bulkCreateQuestions = async (req, res) => {
  const { questions, level, set } = req.body;

  if (!questions || !Array.isArray(questions) || questions.length < 1) {
    return res.status(400).json({ success: false, message: "Questions array is required" });
  }

  if (!level || !set) {
    return res.status(400).json({ success: false, message: "level and set are required" });
  }

  // use createdby from client if provided, otherwise default to 3
  const createdby = req.body.createdby || 3;

  const result = await QuestionService.bulkCreateQuestions(questions, level, set, createdby);
  res.status(201).json({ success: true, insertedRows: result.affectedRows });
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
