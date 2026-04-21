const ExamScheduleModel = require("../models/ExamScheduleModel");
// const paperCache = new Map();

exports.create = async (req, res) => {
  console.log("data", req.body);

  try {
    const [result] = await ExamScheduleModel.create(req.body);
    res.status(201).json({
      id: result.insertId,
      message: "Exam scheduled successfully"
    });
  } catch (err) {
    console.error(err);

    // 🎯 Custom business validation error
    if (err.code === "SET_NOT_AVAILABLE") {
      return res.status(400).json({
        message: err.message // "Set not available for this level"
      });
    }

    // ❌ Generic server error
    res.status(500).json({
      message: "Failed to create exam schedule"
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await ExamScheduleModel.findAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch exam schedules" });
  }
};

// controllers/examScheduleController.js
exports.getlevelwise = async (req, res) => {
  try {
    const { level, createdby } = req.query;

    if (!level || !createdby) {
      return res.status(400).json({
        message: "level and createdby are required",
      });
    }

    // const cacheKey = `studentexam_${createdby}_${level}`;
    // if (paperCache.has(cacheKey)) {
    //   console.log("⚡ Cache HIT");
    //   return res.status(200).json({
    //     success: true,
    //     data: paperCache.get(cacheKey),
    //   });
    // }

    const [rows] = await ExamScheduleModel.findLevelWise({
      level: Number(level),
      createdby: Number(createdby),
    });

    const formatToLocal = (date) => {
      if (!date) return null;

      const d = new Date(date);

      return d.toLocaleString("sv-SE", {
        timeZone: "Asia/Kolkata"
      }).replace(" ", "T");
    };

    const formattedRows = rows.map(row => ({
      ...row,
      start_time: formatToLocal(row.start_time),
      end_time: formatToLocal(row.end_time),
      date: formatToLocal(row.date)
    }));

    res.json(formattedRows);

  } catch (err) {
    console.error("❌ getlevelwise error:", err);
    res.status(500).json({ message: "Failed to fetch exam schedules" });
  }
};


exports.getById = async (req, res) => {
  try {
    const [[row]] = await ExamScheduleModel.findById(req.params.id);
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch exam schedule" });
  }
};

exports.getByadmin = async (req, res) => {
  try {
    const [row] = await ExamScheduleModel.findByadmin(req.params.id);
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch exam schedule" });
  }
};

exports.update = async (req, res) => {
  try {
    await ExamScheduleModel.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update exam schedule" });
  }
};

exports.remove = async (req, res) => {
  try {
    await ExamScheduleModel.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete exam schedule" });
  }
};

exports.getByDate = async (req, res) => {
  const [rows] = await ExamScheduleModel.findByDate(req.query.date);
  res.json(rows);
};

exports.getLiveExam = async (req, res) => {
  try {
    const { level, createdby } = req.query;

    if (!level || !createdby) {
      return res.status(400).json({
        message: "level and createdby are required",
      });
    }

    const [rows] = await ExamScheduleModel.findLiveExam({
      level: Number(level),
      createdby: Number(createdby),
    });

    if (rows.length === 0) {
      return res.json({
        is_exam_live: false,
        exam: null
      });
    }

    return res.json({
      is_exam_live: true,
      exam: rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch live exam" });
  }
};