const pool = require("../config/db");

module.exports = {

  findById: (id) =>
  pool.query(
    `SELECT * FROM exam_schedule WHERE id = ?`,
    [id]
  ),

    findByadmin: (id) =>
  pool.query(
    `SELECT * FROM exam_schedule WHERE createdby = ?`,
    [id]
  ),

  create: (data) =>
    pool.query(
      `INSERT INTO exam_schedule
      (exam_level, exam_title, paper_set, date, start_time, end_time, createdby)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.exam_level,
        data.exam_title,
        data.paper_set,
        data.date,
        data.start_time,
        data.end_time,
        data.createdby
      ]
    ),

  findAll: () =>
    pool.query(`
      SELECT es.*, l.level AS level_name
      FROM exam_schedule es
      JOIN levels l ON l.id = es.exam_level
      ORDER BY es.date, es.start_time
    `),

  findByDate: (date) =>
    pool.query(
      `SELECT es.*, l.level AS level_name
       FROM exam_schedule es
       JOIN levels l ON l.id = es.exam_level
       WHERE es.date = ?
       ORDER BY es.start_time`,
      [date]
    ),

  update: (id, data) =>
    pool.query(
      `UPDATE exam_schedule SET
        exam_level = ?,
        exam_title = ?,
        paper_set = ?,
        date = ?,
        start_time = ?,
        end_time = ?
       WHERE id = ?`,
      [
        data.exam_level,
        data.exam_title,
        data.paper_set,
        data.date,
        data.start_time,
        data.end_time,
        id
      ]
    ),

  remove: (id) =>
    pool.query(`DELETE FROM exam_schedule WHERE id = ?`, [id])
};
