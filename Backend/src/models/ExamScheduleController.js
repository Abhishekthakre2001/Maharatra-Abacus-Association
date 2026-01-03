const ExamScheduleModel = require("../models/ExamScheduleModel");

exports.create = async (req, res) => {
  const [result] = await ExamScheduleModel.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.getAll = async (req, res) => {
  const [rows] = await ExamScheduleModel.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [[row]] = await ExamScheduleModel.findById(req.params.id);
  res.json(row);
};

exports.update = async (req, res) => {
  await ExamScheduleModel.update(req.params.id, req.body);
  res.json({ success: true });
};

exports.remove = async (req, res) => {
  await ExamScheduleModel.remove(req.params.id);
  res.json({ success: true });
};
