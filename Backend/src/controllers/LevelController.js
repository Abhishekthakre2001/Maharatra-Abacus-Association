const LevelModel = require("../models/LevelModel");

exports.create = async (req, res) => {
  try {
    // Check if level already exists for this user
    const [[existing]] = await LevelModel.findByLevelAndUser(req.body.level, req.body.createdby);
    if (existing) {
      return res.status(400).json({ error: "Level already exists for this user" });
    }
    
    const [result] = await LevelModel.create(req.body);
    res.status(201).json({ 
      id: result.insertId, 
      level: req.body.level,
      level_name: req.body.level_name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
  try {
    // Check if another level with same name exists for this user (excluding current one)
    const [existing] = await LevelModel.findByLevelAndUser(req.body.level, req.body.createdby);
    if (existing && existing.length > 0 && existing[0].id !== parseInt(req.params.id)) {
      return res.status(400).json({ error: "Level already exists for this user" });
    }
    
    await LevelModel.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  await LevelModel.remove(req.params.id);
  res.json({ success: true });
};
