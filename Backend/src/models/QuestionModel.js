const pool = require("../config/db");

const QuestionModel = {
  // create: async (data) => {
  //   const sql = `
  //     INSERT INTO questions
  //     (question, option1, option2, option3, option4, correctoption, level, set_id, createdby)
  //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  //   `;
  //   const [result] = await pool.query(sql, [
  //     data.question,
  //     data.option1,
  //     data.option2,
  //     data.option3,
  //     data.option4,
  //     data.correctoption,
  //     data.level,
  //     data.set_id,
  //     data.createdby
  //   ]);
  //   return result;
  // },
  create: async (data) => {
    console.log("data", data)
    // 1️⃣ Get set_time from sets table
    const getSetTimeSql = `
    SELECT set_time, ismockset
    FROM questions
    WHERE level = ? AND set_id = ?
    LIMIT 1
  `;

    const [setRows] = await pool.query(getSetTimeSql, [
      data.level,
      data.set_id
    ]);

    if (setRows.length === 0) {
      throw new Error("set_time not found for given level and set_id");
    }

    const set_time = setRows[0].set_time;
    const ismockset = setRows[0].ismockset

    console.log("ismockset ", ismockset)

    // 2️⃣ Insert question with set_time
    const insertSql = `
    INSERT INTO questions
    (
      question,
      option1,
      option2,
      option3,
      option4,
      correctoption,
      level,
      set_id,
      set_time,
      ismockset,
      createdby
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const [result] = await pool.query(insertSql, [
      data.question,
      data.option1,
      data.option2,
      data.option3,
      data.option4,
      data.correctoption,
      data.level,
      data.set_id,
      set_time,
      ismockset,
      data.createdby
    ]);

    return result;
  },



  findAll: async () => {
    const [rows] = await pool.query(`
      SELECT q.*, l.level, s.set_name
      FROM questions q
      JOIN levels l ON q.level = l.id
      JOIN sets s ON q.set_id = s.id
    `);
    return rows;
  },


  findByAdmin: async (adminId) => {
    const [rows] = await pool.query(
      ` SELECT * FROM questions WHERE createdby = ? `,
      [adminId]
    );

    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM questions WHERE id = ?", [id]
    );
    return rows[0];
  },

  update: async (id, data) => {
    console.log(data)
    const sql = `
      UPDATE questions SET
      question=?, option1=?, option2=?, option3=?, option4=?,
      correctoption=?
      WHERE id=?
    `;
    const [result] = await pool.query(sql, [
      data.question,
      data.option1,
      data.option2,
      data.option3,
      data.option4,
      data.correctoption,
      id
    ]);
    return result;
  },

  updateSet: async (data) => {
    console.log("data", data);

    const sql = `
    UPDATE questions
    SET set_time = ?, isMockSet = ?
    WHERE level = ? AND set_id = ?
  `;

    const [result] = await pool.query(sql, [
      data.total_time, // "10:00:00"
      data.isMockSet,
      data.level,      // 1
      data.set         // "B"
    ]);

    return result;
  },

  remove: async (id) => {
    const [result] = await pool.query(
      "DELETE FROM questions WHERE id = ?", [id]
    );
    return result;
  },

  removeSet: async (level, set_id) => {
    const [result] = await pool.query(
      "DELETE FROM questions WHERE level = ? AND set_id = ?", [level, set_id]
    );
    return result;
  },

  bulkCreate: async (questions, level, set_id, createdby, time, ismockset) => {
    // questions: array of objects with keys: question, option1..option4, correctoption (number or string)
    const values = questions.map((q) => [
      q.question || q.Question || "",
      q.option1 || q["Option 1"] || "",
      q.option2 || q["Option 2"] || "",
      q.option3 || q["Option 3"] || "",
      q.option4 || q["Option 4"] || "",
      Number(q.correctoption ?? q["Correct Option"] ?? 0) || 0,
      level,
      set_id,
      time,
      createdby,
      ismockset
    ]);

    const sql = `
      INSERT INTO questions
      (question, option1, option2, option3, option4, correctoption, level, set_id, set_time, createdby, ismockset)
      VALUES ?
    `;

    const [result] = await pool.query(sql, [values]);
    return result;
  },

  // models/QuestionModel.js
  getSetsByLevelAndCreator: ({ level, createdby }) =>
    pool.query(
      `
    SELECT DISTINCT 
      level,
      TRIM(UPPER(set_id)) AS set_id
    FROM questions
    WHERE createdby = ?
      AND level = ?
    ORDER BY set_id
    `,
      [createdby, level]
    ),

  getPaperset: ({ level, createdby, set }) =>
    pool.query(
      `
    SELECT 
     *
    FROM questions
    WHERE createdby = ?
      AND level = ? AND set_id = ?
    `,
      [createdby, level, set]
    ),
};

module.exports = QuestionModel;
