const LevelModel = require("../models/LevelModel");

exports.create = async (req, res) => {
  const [result] = await LevelModel.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.getAll = async (req, res) => {
  const [rows] = await LevelModel.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [[row]] = await LevelModel.findById(req.params.id);
  res.json(row);
};

exports.getAllByAdmin = async (req, res) => {
  const [rows] = await LevelModel.findAllByAdmin(req.query.adminid);
  res.json(rows);
};

exports.update = async (req, res) => {
  await LevelModel.update(req.params.id, req.body);
  res.json({ success: true });
};

exports.remove = async (req, res) => {
  await LevelModel.remove(req.params.id);
  res.json({ success: true });
};
