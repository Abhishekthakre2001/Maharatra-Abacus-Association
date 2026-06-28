const RegistrationModel = require("../models/RegistrationModel");

exports.getRegistrationData = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const admin = await RegistrationModel.findUserByUsername(username);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Username not found",
      });
    }

    const [settings, institutes, levels] = await Promise.all([
      RegistrationModel.getSettings(admin.id),
      RegistrationModel.getInstitutes(admin.id),
      RegistrationModel.getLevels(admin.id),
    ]);

    return res.status(200).json({
      success: true,
      admin,
      settings,
      institutes,
      levels,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};