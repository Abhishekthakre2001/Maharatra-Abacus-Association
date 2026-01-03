const SetModel = require("../models/SetModel");

exports.create = async (req, res) => {
  const [result] = await SetModel.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.getAll = async (req, res) => {
  const [rows] = await SetModel.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [[row]] = await SetModel.findById(req.params.id);
  res.json(row);
};

exports.update = async (req, res) => {
  await SetModel.update(req.params.id, req.body);
  res.json({ success: true });
};

exports.remove = async (req, res) => {
  await SetModel.remove(req.params.id);
  res.json({ success: true });
};
