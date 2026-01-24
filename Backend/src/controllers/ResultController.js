const ResultModel = require("../models/ResultModel");

exports.create = async (req, res) => {
  const [result] = await ResultModel.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.getAll = async (req, res) => {
  const [rows] = await ResultModel.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [row] = await ResultModel.findById(req.params.id);
  res.json(row);
};

exports.update = async (req, res) => {
  await ResultModel.update(req.params.id, req.body);
  res.json({ success: true });
};

exports.remove = async (req, res) => {
  await ResultModel.remove(req.params.id);
  res.json({ success: true });
};

exports.checkExamSubmission = async (req, res) => {
  const { user_id, exam_id } = req.query;

  if (!user_id || !exam_id) {
    return res.status(400).json({
      exam: false,
      message: "user_id and exam_id are required"
    });
  }

  const [rows] = await ResultModel.findByUserAndExam(user_id, exam_id);

  if (rows.length > 0) {
    return res.json({
      exam: true,
      user_id: Number(user_id),
      exam_id: Number(exam_id)
    });
  }

  return res.json({ exam: false });
};

