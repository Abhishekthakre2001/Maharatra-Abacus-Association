const ExamResultModel = require("../models/ExamResultModel");

const getIndianDateTimeParts = () => {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const map = {};

  parts.forEach((p) => {
    if (p.type !== "literal") map[p.type] = p.value;
  });

  const date = `${map.year}-${map.month}-${map.day}`;
  const time = `${map.hour}:${map.minute}:${map.second}`;
  const datetime = `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second}`;

  return { date, time, datetime };
};

exports.startExam = async (req, res) => {
  try {
    const {
      user_id,
      exam_id,
      admin_id,
      Exam_name,
      exam_time,
      total_question,
      Exam_level,
      paper_set,
    } = req.body;

    if (
      !user_id ||
      !exam_id ||
      !admin_id ||
      !Exam_name ||
      !exam_time ||
      !total_question ||
      !Exam_level ||
      !paper_set
    ) {
      return res.status(400).json({
        success: false,
        message:
          "user_id, exam_id, admin_id, Exam_name, exam_time, total_question, Exam_level and paper_set are required",
      });
    }

    const existing = await ExamResultModel.findStartedOrSubmitted(user_id, exam_id);

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Exam already started or submitted for this user",
        data: existing[0],
      });
    }

    const { date, datetime } = getIndianDateTimeParts();

    const payload = {
      user_id,
      exam_id,
      admin_id,
      Exam_name,
      date,
      exam_start_at: datetime,
      exam_time,
      total_question,
      Exam_level,
      paper_set,
    };

    const [result] = await ExamResultModel.startExam(payload);

    return res.status(201).json({
      success: true,
      message: "Exam started successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("startExam error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to start exam",
    });
  }
};

// HH:mm:ss → seconds
const timeToSeconds = (timeStr) => {
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 3600 + m * 60 + s;
};

// seconds → HH:mm:ss
const secondsToTime = (seconds) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const parseMysqlDateTime = (value) => {
  if (!value) return null;

  // If already a JS Date object
  if (value instanceof Date) {
    return value;
  }

  // If MySQL returned string
  if (typeof value === "string") {
    return new Date(value.replace(" ", "T") + "+05:30");
  }

  // fallback
  return new Date(value);
};

exports.submitExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { total_solve, total_unsolve, total_correct } = req.body;

    if (
      total_solve === undefined ||
      total_unsolve === undefined ||
      total_correct === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "total_solve, total_unsolve, total_correct are required",
      });
    }

    const examRow = await ExamResultModel.findByRecordId(id);

    if (examRow.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Exam record not found",
      });
    }

    if (examRow[0].status === "SUBMITTED") {
      return res.status(409).json({
        success: false,
        message: "Exam already submitted",
      });
    }

    const { datetime } = getIndianDateTimeParts();

    const startDateTime = examRow[0].exam_start_at;

    if (!startDateTime) {
      return res.status(400).json({
        success: false,
        message: "Exam start time not found",
      });
    }

    // const start = parseMysqlDateTime(startDateTime);
    // const end = parseMysqlDateTime(datetime);

    // if (!start || isNaN(start.getTime())) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid exam start time",
    //   });
    // }

    // if (!end || isNaN(end.getTime())) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid exam end time",
    //   });
    // }

    // let totalSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);

    // if (totalSeconds < 0) totalSeconds = 0;

    // const time_taken = secondsToTime(totalSeconds);
    const extractTimePart = (value) => {
      if (!value) return null;

      if (value instanceof Date) {
        const h = String(value.getHours()).padStart(2, "0");
        const m = String(value.getMinutes()).padStart(2, "0");
        const s = String(value.getSeconds()).padStart(2, "0");
        return `${h}:${m}:${s}`;
      }

      if (typeof value === "string") {
        const str = value.trim();

        // "YYYY-MM-DD HH:mm:ss"
        if (str.includes(" ")) {
          return str.split(" ")[1];
        }

        // "HH:mm:ss"
        return str;
      }

      return null;
    };

    const startTimeOnly = extractTimePart(startDateTime);
    const endTimeOnly = extractTimePart(datetime);

    if (!startTimeOnly) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam start time",
      });
    }

    if (!endTimeOnly) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam end time",
      });
    }

    const startSeconds = timeToSeconds(startTimeOnly);
    const endSeconds = timeToSeconds(endTimeOnly);

    let totalSeconds = endSeconds - startSeconds;

    // handles crossing midnight
    if (totalSeconds < 0) {
      totalSeconds = (24 * 3600 - startSeconds) + endSeconds;
    }

    // const time_taken = secondsToTime(totalSeconds);

    const time_taken = secondsToTime(totalSeconds);

    // ✅ NEW LOGIC: cap time_taken to exam_time
    const examTime = examRow[0].exam_time; // format: HH:mm:ss

    if (examTime) {
      const examSeconds = timeToSeconds(examTime);

      if (totalSeconds > examSeconds) {
        totalSeconds = examSeconds;
      }
    }

    // final corrected time_taken
    const final_time_taken = secondsToTime(totalSeconds);

    await ExamResultModel.submitExam(id, {
      exam_end_at: datetime,
      time_taken: final_time_taken,
      total_solve,
      total_unsolve,
      total_correct,
    });

    return res.json({
      success: true,
      message: "Exam submitted successfully",
      time_taken: final_time_taken,
    });
  } catch (error) {
    console.error("submitExam error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit exam",
    });
  }
};



exports.getAll = async (req, res) => {
  try {
    const [rows] = await ExamResultModel.findAll();
    res.json(rows);
  } catch (error) {
    console.error("getAll error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch records" });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await ExamResultModel.findById(req.params.id);
    res.json(rows);
  } catch (error) {
    console.error("getById error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch record" });
  }
};

exports.getByStudentId = async (req, res) => {
  try {
    const [rows] = await ExamResultModel.findByStudentId(req.params.user_id);
    res.json(rows);
  } catch (error) {
    console.error("getByStudentId error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch student exam history" });
  }
};

exports.checkExamStatus = async (req, res) => {
  try {
    const { user_id, exam_id } = req.query;

    if (!user_id || !exam_id) {
      return res.status(400).json({
        success: false,
        message: "user_id and exam_id are required",
      });
    }

    const rows = await ExamResultModel.findStartedOrSubmitted(user_id, exam_id);

    if (rows.length > 0) {
      return res.json({
        success: true,
        exam: true,
        data: rows[0],
      });
    }

    return res.json({
      success: true,
      exam: false,
    });
  } catch (error) {
    console.error("checkExamStatus error:", error);
    res.status(500).json({ success: false, message: "Failed to check exam status" });
  }
};

exports.remove = async (req, res) => {
  try {
    await ExamResultModel.remove(req.params.id);
    res.json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    console.error("remove error:", error);
    res.status(500).json({ success: false, message: "Failed to delete record" });
  }
};

exports.getexamresultByAdminId = async (req, res) => {
  try {
    const { admin_id } = req.params;

    if (!admin_id) {
      return res.status(400).json({
        success: false,
        message: "admin_id is required",
      });
    }

    const [rows] = await ExamResultModel.findExamResultByAdminId(admin_id);

    return res.status(200).json({
      success: true,
      message: "Exam results fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("getByAdminId error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch exam results by admin id",
    });
  }
};