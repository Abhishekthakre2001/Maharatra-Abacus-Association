const ExamScheduleModel = require("../models/ExamScheduleModel");

exports.create = async (req, res) => {
   console.log("data",req.body);
  try {
    const [result] = await ExamScheduleModel.create(req.body);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create exam schedule" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await ExamScheduleModel.findAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch exam schedules" });
  }
};

exports.getById = async (req, res) => {
  try {
    const [[row]] = await ExamScheduleModel.findById(req.params.id);
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch exam schedule" });
  }
};

exports.getByadmin = async (req, res) => {
  try {
    const [row] = await ExamScheduleModel.findByadmin(req.params.id);
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch exam schedule" });
  }
};

exports.update = async (req, res) => {
  try {
    await ExamScheduleModel.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update exam schedule" });
  }
};

exports.remove = async (req, res) => {
  try {
    await ExamScheduleModel.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete exam schedule" });
  }
};

exports.getByDate = async (req, res) => {
  const [rows] = await ExamScheduleModel.findByDate(req.query.date);
  res.json(rows);
};

