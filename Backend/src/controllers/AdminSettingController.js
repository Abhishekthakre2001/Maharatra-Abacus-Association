const AdminSettingModel = require("../models/AdminSettingModel");

exports.create = async (req, res) => {
  const [result] = await AdminSettingModel.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.getAll = async (req, res) => {
  const [rows] = await AdminSettingModel.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [[row]] = await AdminSettingModel.findById(req.params.id);
  res.json(row);
};

exports.update = async (req, res) => {
  await AdminSettingModel.update(req.params.id, req.body);
  res.json({ success: true });
};

exports.remove = async (req, res) => {
  await AdminSettingModel.remove(req.params.id);
  res.json({ success: true });
};