const QuestionService = require("../services/QuestionService");

exports.createQuestion = async (req, res) => {
  const result = await QuestionService.createQuestion(req.body);
  res.status(201).json({ success: true, id: result.insertId });
};

// Bulk create questions from CSV/array
exports.bulkCreateQuestions = async (req, res) => {
  const { questions, level, set, time, ismockset } = req.body;

  if (!questions || !Array.isArray(questions) || questions.length < 1) {
    return res.status(400).json({ success: false, message: "Questions array is required" });
  }

  if (!level || !set) {
    return res.status(400).json({ success: false, message: "level and set are required" });
  }

  if (!time) {
    return res.status(400).json({ success: false, message: "time is required" });
  }

  // use createdby from client if provided, otherwise default to 3
  const createdby = req.body.createdby;

  const result = await QuestionService.bulkCreateQuestions(questions, level, set, createdby, time, ismockset);
  res.status(201).json({ success: true, insertedRows: result.affectedRows });
};

exports.getQuestionsByAdmin = async (req, res) => {
  const rows = await QuestionService.getQuestionsByAdmin(req.params.id);

  // Group by level + set_id
  const grouped = {};

  for (const q of rows) {
    const key = `${q.level}_${q.set_id}`;

    if (!grouped[key]) {
      grouped[key] = {
        set: q.set_id,
        level: q.level,
        ismock :q.ismockset,
        paper_set: `${q.level}-${q.set_id}`,
        total_question: 0,
        total_time: q.set_time,
        questions: []
      };
    }

    grouped[key].questions.push({
      id: q.id,
      question: q.question,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4,
      correctoption: q.correctoption,
      createdat: q.createdat
    });

    grouped[key].total_question++;
  }

  // Convert object → array
  const response = Object.values(grouped);

  res.json(response);
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

exports.updateSet = async (req, res) => {
  console.log("controler", req.body);
  await QuestionService.updateSet(req.body);
  res.json({ success: true });
};

exports.deleteQuestion = async (req, res) => {
  await QuestionService.deleteQuestion(req.params.id);
  res.json({ success: true });
};

exports.deleteSet = async (req, res) => {
  await QuestionService.deleteSet(req.params.level, req.params.set);
  res.json({ success: true });
};

