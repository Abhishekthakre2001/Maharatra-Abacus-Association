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
};

module.exports = QuestionModel;
