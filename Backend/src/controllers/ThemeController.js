const Thememodel = require("../models/Thememodel");


exports.getById = async (req, res) => {
  const [[row]] = await Thememodel.findById(req.params.id);
  res.json(row);
};

