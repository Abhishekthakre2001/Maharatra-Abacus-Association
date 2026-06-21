const QuestionService = require("../services/QuestionService");
const QuestionModel = require("../models/QuestionModel");
const {
  getPaginationParams,
  buildPaginationResponse,
} = require("../utils/getPaginationParams");
const formatExcelData = require("../utils/formatExcelData");
const exportToExcel = require("../utils/excelExport");

// const paperCache = new Map();

exports.createQuestion = async (req, res) => {
  const result = await QuestionService.createQuestion(req.body);
  res.status(201).json({ success: true, id: result.insertId });
};

// Bulk create questions from CSV/array
exports.bulkCreateQuestions = async (req, res) => {
  try {
    const { questions, level, set, time, ismockset } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Questions array is required",
      });
    }

    const createdby = req.body.createdby;

    const result = await QuestionService.bulkCreateQuestions(
      questions,
      level,
      set,
      createdby,
      time,
      ismockset,
    );

    res.status(201).json({
      success: true,
      insertedRows: result.affectedRows,
    });
  } catch (err) {
    console.error(err);

    if (err.code === "SET_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Set already exists. Please choose another set.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload questions",
    });
  }
};

// exports.getQuestionsByAdmin = async (req, res) => {
//   const rows = await QuestionService.getQuestionsByAdmin(req.params.id);

//   // Group by level + set_id
//   const grouped = {};

//   for (const q of rows) {
//     const key = `${q.level}_${q.set_id}`;

//     if (!grouped[key]) {
//       grouped[key] = {
//         set: q.set_id,
//         level: q.level,
//         level_name: q.level_name || null,
//         ismock: q.ismockset,
//         paper_set: `${q.level}-${q.set_id}`,
//         total_question: 0,
//         total_time: q.set_time,
//         questions: [],
//       };
//     }

//     grouped[key].questions.push({
//       id: q.id,
//       question: q.question,
//       option1: q.option1,
//       option2: q.option2,
//       option3: q.option3,
//       option4: q.option4,
//       correctoption: q.correctoption,
//       createdat: q.createdat,
//     });

//     grouped[key].total_question++;
//   }

//   // Convert object → array
//   const response = Object.values(grouped);

//   // res.json(response);
// };

exports.getQuestionsByAdmin = async (req, res) => {
  const { page, limit, search } = getPaginationParams(req);

  const result = await QuestionService.getQuestionsByAdmin(
    req.params.id,
    page,
    limit,
    search,
  );

  res.json(result);
};
exports.getQuestions = async (req, res) => {
  const data = await QuestionService.getQuestions();
  res.json(data);
};

exports.getQuestionById = async (req, res) => {
  const data = await QuestionService.getQuestionById(req.params.id);
  res.json(data);
};

exports.updateQuestion = async (req, res) => {
  await QuestionService.updateQuestion(req.params.id, req.body);
  res.json({ success: true });
};

exports.updateSet = async (req, res) => {
  console.log("controler", req.body);
  await QuestionService.updateSet(req.body);
  res.json({ success: true });
};

exports.deleteQuestion = async (req, res) => {
  await QuestionService.deleteQuestion(req.params.id);
  res.json({ success: true });
};

exports.deleteSet = async (req, res) => {
  await QuestionService.deleteSet(req.params.level, req.params.set);
  res.json({ success: true });
};

exports.getLevelWiseSets = async (req, res) => {
  console.log("req aya", req.query);

  const level = parseInt(req.query.level, 10);
  const createdby = parseInt(req.query.createdby, 10);

  // const cacheKey = `levelwisesets_${createdby}_${level}`;

  // // ✅ Cache check
  // if (paperCache.has(cacheKey)) {
  //   console.log("⚡ Cache HIT");
  //   const rows = paperCache.get(cacheKey);

  //   return res.status(200).json({
  //     success: true,
  //     level: rows.length ? rows[0].level_name : null,
  //     data: rows,
  //     formatted: rows.map(r => `${r.level}${r.set_id}`),
  //   });
  // }

  const [rows] = await QuestionService.getSetsByLevelAndCreator({
    level,
    createdby,
  });

  // paperCache.set(cacheKey, rows);

  res.status(200).json({
    success: true,
    level: rows.length ? rows[0].level_name : null,
    data: rows,
    formatted: rows.map((r) => `${r.level}${r.set_id}`),
  });
};

exports.getpaperset = async (req, res) => {
  console.log("req aya", req.query);

  const level = parseInt(req.query.level, 10);
  const createdby = parseInt(req.query.createdby, 10);
  const set = String(req.query.set);

  // const cacheKey = `${createdby}_${level}_${set}`;

  // // ✅ Check cache first
  // if (paperCache.has(cacheKey)) {
  //   console.log("⚡ Cache HIT");
  //   return res.json({
  //     success: true,
  //     data: paperCache.get(cacheKey),
  //   });
  // }

  console.log("🔥 DB HIT");

  const [rows] = await QuestionService.getpaperSet({
    level,
    createdby,
    set,
  });

  // ✅ Shuffle in Node (instead of DB)
  const shuffled = rows.sort(() => Math.random() - 0.5);

  // ✅ Store in cache
  // paperCache.set(cacheKey, shuffled);

  res.status(200).json({
    success: true,
    data: shuffled,
  });
};

exports.exportQuestionSet = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await QuestionModel.findByAdmin(
      id,
      1,
      999999,
      ""
    );

    const data = result.data || [];

    const formattedData = formatExcelData(
      data.map((item) => ({
        ...item,
        ismock: item.ismock ? "Yes" : "No",
      })),
      [
        {
          key: "paper_set",
          label: "Paper Set",
        },
        {
          key: "ismock",
          label: "Is Test Set",
        },
        {
          key: "total_time",
          label: "Time ( HH:MM:SS )",
        },
        {
          key: "total_question",
          label: "Total Questions",
        },
        {
          key: "level",
          label: "Level",
        },
        {
          key: "set",
          label: "Set",
        },
      ]
    );

    const buffer = exportToExcel({
      data: formattedData,
      sheetName: "Question Sets",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="question-sets.xlsx"'
    );

    return res.send(buffer);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
