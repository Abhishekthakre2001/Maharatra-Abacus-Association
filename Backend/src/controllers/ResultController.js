const ResultModel = require("../models/ResultModel");
const ExcelJS = require("exceljs");

exports.create = async (req, res) => {
  const [result] = await ResultModel.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.getAll = async (req, res) => {
  const [rows] = await ResultModel.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [row] = await ResultModel.findById(req.params.id);
  res.json(row);
};

exports.update = async (req, res) => {
  await ResultModel.update(req.params.id, req.body);
  res.json({ success: true });
};

exports.remove = async (req, res) => {
  await ResultModel.remove(req.params.id);
  res.json({ success: true });
};

exports.checkExamSubmission = async (req, res) => {
  const { user_id, exam_id } = req.query;

  if (!user_id || !exam_id) {
    return res.status(400).json({
      exam: false,
      message: "user_id and exam_id are required"
    });
  }

  const [rows] = await ResultModel.findByUserAndExam(user_id, exam_id);

  if (rows.length > 0) {
    return res.json({
      exam: true,
      user_id: Number(user_id),
      exam_id: Number(exam_id)
    });
  }

  return res.json({ exam: false });
};


exports.downloadResultsExcel = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await ResultModel.getAllResultsWithUserName(id);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Results");

    worksheet.columns = [
      { header: "Name", key: "name", width: 20 },
      { header: "Address", key: "address", width: 25 },
      { header: "Mobile Number", key: "mobilenumber", width: 15 },
      { header: "Level", key: "level_display", width: 20 },
      { header: "DOB", key: "dob", width: 15 },

      { header: "Total Questions", key: "total_question", width: 18 },
      { header: "Total Answer", key: "total_answer", width: 18 },
      { header: "Total Correct", key: "total_correct", width: 18 },
      { header: "Total Unsolve", key: "total_unsolve", width: 18 },

      { header: "Date", key: "date", width: 15 },
      { header: "Time", key: "time", width: 15 },
      { header: "Total Time", key: "totaltime", width: 15 },
      { header: "Time Taken", key: "time_taken", width: 15 },

      { header: "Result For", key: "resultfor", width: 15 },
      { header: "Exam Title", key: "examtitle", width: 20 },

      { header: "Paper Set", key: "PaperSet", width: 12 },
      { header: "Paper Level", key: "Paperlevel", width: 18 },
    ];

    data.forEach((item) => {
      worksheet.addRow({
        name: item.user_name || "NA",
        address: item.address || "NA",
        mobilenumber: item.mobilenumber || "NA",
        level_display: item.level_display || "NA",
        dob: item.dob || "NA",

        total_question: item.total_question || 0,
        total_answer: item.total_answer || 0,
        total_correct: item.total_correct || 0,
        total_unsolve: item.total_unsolve || 0,

        date: item.date || "NA",
        time: item.time || "NA",
        totaltime: item.totaltime || "NA",
        time_taken: item.time_taken || "NA",

        resultfor: item.resultfor || "NA",
        examtitle: item.examtitle || "NA",

        PaperSet:
          item.PaperSet && String(item.PaperSet).trim() !== ""
            ? item.PaperSet
            : "NA",

        Paperlevel:
          item.Paperlevel && String(item.Paperlevel).trim() !== ""
            ? item.Paperlevel
            : "NA",
      });
    });

    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=results.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Excel download error:", error);
    res.status(500).json({
      success: false,
      message: "Excel generation failed",
    });
  }
};