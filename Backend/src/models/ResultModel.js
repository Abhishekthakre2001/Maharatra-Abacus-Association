const pool = require("../config/db");

module.exports = {
  create: (data) =>
    pool.query(
      `INSERT INTO result
      (user_id, total_question, total_answer, total_correct, total_unsolve,
       date, time, totaltime, time_taken, createdby, resultfor, examtitle, exam_id, PaperSet,
      Paperlevel)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        data.exam_id,
        data.set,
        data.Level
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
    pool.query(
      `SELECT 
        r.*,
        u.name ,
        u.username,
        u.class,
        u.mobilenumber
     FROM result r
     INNER JOIN users u
       ON r.user_id = u.id
     WHERE r.user_id = ?
     ORDER BY r.id DESC`,
      [id]
    ),

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

  // findByUserAndExam: (user_id, exam_id) =>
  //   pool.query(
  //     `SELECT id FROM result 
  //    WHERE user_id = ? AND exam_id = ?
  //    LIMIT 1`,
  //     [user_id, exam_id]
  //   ),

  findByUserAndExam: (user_id, exam_id) =>
    pool.query(
      `SELECT 
        id,
        user_id,
        exam_id,
        admin_id,
        exam_name,
        exam_level,
        paper_set,
        date,
        exam_start_at,
        exam_end_at,
        exam_time,
        time_taken,
        total_question,
        total_solve,
        total_unsolve,
        total_correct,
        status,
        created_at,
        updated_at
     FROM Exam_Result
     WHERE user_id = ? AND exam_id = ?
     ORDER BY id DESC
     LIMIT 1`,
      [user_id, exam_id]
    ),


  remove: (id) =>
    pool.query("DELETE FROM result WHERE id = ?", [id]),

  getAllResultsWithUserName: async (id) => {
    const [rows] = await pool.query(`
    SELECT
      r.id,
      r.user_id,
      r.total_question,
      r.total_answer,
      r.total_correct,
      r.total_unsolve,
      r.date,
      r.time,
      r.totaltime,
      r.time_taken,
      r.resultfor,
      r.examtitle,
      r.exam_id,
      r.PaperSet,
      r.Paperlevel,

      u.name AS user_name,
      u.address,
      u.mobilenumber,
      u.level,
      u.dob,

      l.level_name,
      CONCAT(u.level, ' - ', COALESCE(l.level_name, 'NA')) AS level_display

    FROM result r
    INNER JOIN users u
      ON r.user_id = u.id

    LEFT JOIN levels l
      ON u.level = l.level
      AND u.createdby = l.createdby

    WHERE r.createdby = ?
    ORDER BY r.id DESC
  `, [id]);

    return rows;
  },


  findResultByAdminId: (id) =>
    pool.query(
      `
    SELECT
      r.id,
      r.user_id,
      r.total_question,
      r.total_answer,
      r.total_correct,
      r.total_unsolve,
      r.date,
      r.time,
      r.totaltime,
      r.time_taken,
      r.resultfor,
      r.examtitle,
      r.exam_id,
      r.PaperSet,
      r.Paperlevel,
      r.createdby,

      u.name,
      u.username,
      u.class,
      u.address,
      u.mobilenumber,
      u.dob,
      u.subscription_end_date,
      u.level AS user_level

    FROM result r
    INNER JOIN users u
      ON r.user_id = u.id

    WHERE r.createdby = ?

    ORDER BY 
      u.level ASC,
      r.total_correct DESC,
      r.total_answer DESC,
      r.time_taken ASC,
      r.id DESC
    `,
      [id]
    )
};


