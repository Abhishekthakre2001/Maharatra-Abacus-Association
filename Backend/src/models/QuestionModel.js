const pool = require("../config/db");

const QuestionModel = {
  create: async (data) => {
    const sql = `
      INSERT INTO questions
      (question, option1, option2, option3, option4, correctoption, level, set_id, createdby)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [
      data.question,
      data.option1,
      data.option2,
      data.option3,
      data.option4,
      data.correctoption,
      data.level,
      data.set_id,
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

  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM questions WHERE id = ?", [id]
    );
    return rows[0];
  },

  update: async (id, data) => {
    const sql = `
      UPDATE questions SET
      question=?, option1=?, option2=?, option3=?, option4=?,
      correctoption=?, level=?, set_id=?
      WHERE id=?
    `;
    const [result] = await pool.query(sql, [
      data.question,
      data.option1,
      data.option2,
      data.option3,
      data.option4,
      data.correctoption,
      data.level,
      data.set_id,
      id
    ]);
    return result;
  },

  remove: async (id) => {
    const [result] = await pool.query(
      "DELETE FROM questions WHERE id = ?", [id]
    );
    return result;
  }
  ,
  bulkCreate: async (questions, level, set_id, createdby) => {
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
      createdby
    ]);

    const sql = `
      INSERT INTO questions
      (question, option1, option2, option3, option4, correctoption, level, set_id, createdby)
      VALUES ?
    `;

    const [result] = await pool.query(sql, [values]);
    return result;
  }
};

module.exports = QuestionModel;
