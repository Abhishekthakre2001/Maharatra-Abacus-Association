const pool = require("../config/db");

module.exports = {
  create: (data) =>
    pool.query(
      `INSERT INTO exam_schedule (exam_level, date, time, createdby)
       VALUES (?, ?, ?, ?)`,
      [data.exam_level, data.date, data.time, data.createdby]
    ),

  findAll: () =>
    pool.query(`
      SELECT es.*, l.level
      FROM exam_schedule es
      JOIN levels l ON es.exam_level = l.id
      ORDER BY es.date, es.time
    `),

  findById: (id) =>
    pool.query("SELECT * FROM exam_schedule WHERE id = ?", [id]),

  update: (id, data) =>
    pool.query(
      `UPDATE exam_schedule
       SET exam_level = ?, date = ?, time = ?
       WHERE id = ?`,
      [data.exam_level, data.date, data.time, id]
    ),

  remove: (id) =>
    pool.query("DELETE FROM exam_schedule WHERE id = ?", [id])
};
