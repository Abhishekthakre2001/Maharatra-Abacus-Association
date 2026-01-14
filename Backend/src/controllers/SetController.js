const SetModel = require("../models/SetModel");

exports.create = async (req, res) => {
  try {
    // Check if set already exists for this user
    const [[existing]] = await SetModel.findBySetNameAndUser(req.body.set_name, req.body.createdby);
    if (existing) {
      return res.status(400).json({ error: "Set already exists for this user" });
    }
    
    const [result] = await SetModel.create(req.body);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  const [rows] = await SetModel.findAll();
  res.json(rows);
};

exports.getbyadminid = async (req, res) => {
  const [rows] = await SetModel.findbyadminid(req.params.id);
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [[row]] = await SetModel.findById(req.params.id);
  res.json(row);
};

exports.update = async (req, res) => {
  try {
    // Check if another set with same name exists for this user (excluding current one)
    const [existing] = await SetModel.findBySetNameAndUser(req.body.set_name, req.body.createdby);
    if (existing && existing.length > 0 && existing[0].id !== parseInt(req.params.id)) {
      return res.status(400).json({ error: "Set already exists for this user" });
    }
    
    await SetModel.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  await SetModel.remove(req.params.id);
  res.json({ success: true });
};
