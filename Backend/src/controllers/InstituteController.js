const InstituteModel = require("../models/InstituteModel");

// CREATE
exports.create = async (req, res) => {
  try {
    const [result] = await InstituteModel.create(req.body);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL (pagination + search)
exports.getAll = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    const result = await InstituteModel.findAllPaginated(
      page || 1,
      limit || 10,
      search || ""
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  const [[row]] = await InstituteModel.findById(req.params.id);
  res.json(row);
};

// UPDATE
exports.update = async (req, res) => {
  try {
    await InstituteModel.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  await InstituteModel.remove(req.params.id);
  res.json({ success: true });
};

// EXPORT
exports.exportData = async (req, res) => {
  try {
    const { search, format } = req.query;

    const data = await InstituteModel.exportAll(search || "");

    if (!format || format === "json") {
      return res.json(data);
    }

    if (format === "csv") {
      const fields = Object.keys(data[0] || {});
      const csv = [
        fields.join(","),
        ...data.map((row) =>
          fields.map((f) => `"${row[f] ?? ""}"`).join(",")
        ),
      ].join("\n");

      res.header("Content-Type", "text/csv");
      return res.attachment("institutes.csv").send(csv);
    }

    res.status(400).json({ error: "Invalid format" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};