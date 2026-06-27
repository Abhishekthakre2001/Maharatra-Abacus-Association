const InstituteModel = require("../models/InstituteModel");

// CREATE
exports.create = async (req, res) => {
  try {
    req.body.created_by = req.user.id;

    const [result] = await InstituteModel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Institute created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const result = await InstituteModel.findAllPaginated(
      req.user.id,
      page,
      limit,
      search
    );

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  try {
    const [[row]] = await InstituteModel.findById(
      req.params.id,
      req.user.id
    );

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Institute not found",
      });
    }

    res.json({
      success: true,
      data: row,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const [result] = await InstituteModel.update(
      req.params.id,
      req.user.id,
      req.body
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Institute not found",
      });
    }

    res.json({
      success: true,
      message: "Institute updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const [result] = await InstituteModel.remove(
      req.params.id,
      req.user.id
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Institute not found",
      });
    }

    res.json({
      success: true,
      message: "Institute deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// EXPORT
exports.exportData = async (req, res) => {
  try {
    const { search = "", format = "json" } = req.query;

    const data = await InstituteModel.exportAll(
      req.user.id,
      search
    );

    if (format === "csv") {
      const fields = Object.keys(data[0] || {});

      const csv = [
        fields.join(","),
        ...data.map((row) =>
          fields.map((field) => `"${row[field] ?? ""}"`).join(",")
        ),
      ].join("\n");

      res.header("Content-Type", "text/csv");
      return res.attachment("institutes.csv").send(csv);
    }

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};