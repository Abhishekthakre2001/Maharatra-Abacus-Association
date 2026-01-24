const pool = require("../config/db");

module.exports = {
  create: (data) =>
    pool.query(
      `INSERT INTO result
      (user_id, total_question, total_answer, total_correct, total_unsolve,
       date, time, totaltime, time_taken, createdby, resultfor, examtitle, exam_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.user_id,
        data.total_question,
        data.total_answer,
        data.total_correct,
        data.total_unsolve,
        data.date,
        data.time,
        data.totaltime,
        data.time_taken,
        data.createdby,
        data.resultfor,
        data.examtitle,
        data.exam_id
      ]
    ),

  findAll: () =>
    pool.query(`
      SELECT r.*, u.name AS user_name
      FROM result r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.createdat DESC
    `),

  findById: (id) =>
    pool.query("SELECT * FROM result WHERE user_id = ?", [id]),

  update: (id, data) =>
    pool.query(
      `UPDATE result SET
        total_question=?,
        total_answer=?,
        total_correct=?,
        total_unsolve=?,
        totaltime=?,
        time_taken=?
       WHERE id=?`,
      [
        data.total_question,
        data.total_answer,
        data.total_correct,
        data.total_unsolve,
        data.totaltime,
        data.time_taken,
        id
      ]
    ),

  findByUserAndExam: (user_id, exam_id) =>
    pool.query(
      `SELECT id FROM result 
     WHERE user_id = ? AND exam_id = ?
     LIMIT 1`,
      [user_id, exam_id]
    ),


  remove: (id) =>
    pool.query("DELETE FROM result WHERE id = ?", [id])
};
