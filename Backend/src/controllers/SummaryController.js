const SummaryModel = require("../models/SummaryModel");

exports.getSummary = async (req, res) => {
  try {
    const createdby = Number(req.params.createdby);

    if (!createdby) {
      return res.status(400).json({
        success: false,
        message: "createdby is required"
      });
    }

    const data = await SummaryModel.getSummary(createdby);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch summary"
    });
  }
};
