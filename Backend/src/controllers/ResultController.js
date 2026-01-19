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
