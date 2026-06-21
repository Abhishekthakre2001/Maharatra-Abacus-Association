const pool = require("../config/db");
const { buildPaginationResponse } = require("../utils/getPaginationParams");

module.exports = {
  startExam: (data) =>
    pool.query(
      `INSERT INTO Exam_Result
      (
        user_id,
        exam_id,
        admin_id,
        Exam_name,
        date,
        exam_start_at,
        exam_time,
        total_question,
        Exam_level,
        paper_set,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'STARTED')`,
      [
        data.user_id,
        data.exam_id,
        data.admin_id,
        data.Exam_name,
        data.date,
        data.exam_start_at,
        data.exam_time,
        data.total_question,
        data.Exam_level,
        data.paper_set,
      ],
    ),

  submitExam: (id, data) =>
    pool.query(
      `UPDATE Exam_Result
       SET
         exam_end_at = ?,
         time_taken = ?,
         total_solve = ?,
         total_unsolve = ?,
         total_correct = ?,
         status = 'SUBMITTED'
       WHERE id = ?`,
      [
        data.exam_end_at,
        data.time_taken,
        data.total_solve,
        data.total_unsolve,
        data.total_correct,
        id,
      ],
    ),

  findAll: () =>
    pool.query(`
      SELECT
        er.*,
        u.name AS user_name,
        u.username,
        u.mobilenumber,
        u.address
      FROM Exam_Result er
      LEFT JOIN users u ON er.user_id = u.id
      ORDER BY er.id DESC
    `),

  findById: (id) =>
    pool.query(
      `SELECT
        er.*,
        u.name AS user_name,
        u.username,
        u.mobilenumber,
        u.address
      FROM Exam_Result er
      LEFT JOIN users u ON er.user_id = u.id
      WHERE er.id = ?`,
      [id],
    ),

  findByRecordId: async (id) => {
    const [rows] = await pool.query(
      `SELECT * FROM Exam_Result WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows;
  },

  findByStudentId: (user_id) =>
    pool.query(
      `SELECT *
       FROM Exam_Result
       WHERE user_id = ?
       ORDER BY id DESC`,
      [user_id],
    ),

  findStartedOrSubmitted: async (user_id, exam_id) => {
    const [rows] = await pool.query(
      `SELECT *
       FROM Exam_Result
       WHERE user_id = ? AND exam_id = ?
       ORDER BY id DESC
       LIMIT 1`,
      [user_id, exam_id],
    );
    return rows;
  },

  deleteById: (id) => pool.query(`DELETE FROM Exam_Result WHERE id = ?`, [id]),

  remove: (id) => pool.query(`DELETE FROM Exam_Result WHERE id = ?`, [id]),

  // findExamResultByAdminId: (admin_id) =>
  //   pool.query(
  //     `
  //   SELECT
  //     er.id,
  //     er.user_id,
  //     er.exam_id,
  //     er.admin_id,
  //     er.exam_name,
  //     er.exam_level,
  //     er.paper_set,
  //     er.date,
  //     er.exam_start_at,
  //     er.exam_end_at,
  //     er.exam_time,
  //     er.time_taken,
  //     er.total_question,
  //     er.total_solve,
  //     er.total_unsolve,
  //     er.total_correct,
  //     er.status,
  //     er.created_at,
  //     er.updated_at,

  //     u.name,
  //     u.address,
  //     u.mobilenumber,
  //     u.username,

  //     sr.learning_center_name,
  //     sr.age

  //   FROM Exam_Result er
  //   LEFT JOIN users u
  //     ON er.user_id = u.id
  //   LEFT JOIN student_registration sr
  //     ON er.user_id = sr.user_id
  //   WHERE er.admin_id = ?

  //   ORDER BY
  //     er.exam_name ASC,
  //     er.exam_level ASC,
  //     er.total_correct DESC,
  //     er.total_solve DESC,
  //     er.time_taken ASC,
  //     er.id DESC
  //   `,
  //     [admin_id]
  //   ),

  findExamResultByAdminId: async (
    admin_id,
    page = 1,
    limit = 5,
    search = "",
  ) => {
    const offset = (page - 1) * limit;

    // Total Count
    const [countRows] = await pool.query(
      `
    SELECT COUNT(*) AS total
    FROM Exam_Result er

    LEFT JOIN users u
      ON er.user_id = u.id

    LEFT JOIN student_registration sr
      ON er.user_id = sr.user_id

    WHERE er.admin_id = ?
      AND (
        ? = ''
        OR u.name LIKE ?
        OR u.username LIKE ?
        OR u.mobilenumber LIKE ?
        OR er.exam_name LIKE ?
        OR er.exam_level LIKE ?
        OR sr.learning_center_name LIKE ?
      )
    `,
      [
        admin_id,
        search,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
      ],
    );

    const totalRecords = countRows[0].total;

    // Main Data Query
    const [rows] = await pool.query(
      `
    SELECT
      er.id,
      er.user_id,
      er.exam_id,
      er.admin_id,
      er.exam_name,
      er.exam_level,
      er.paper_set,
      er.date,
      er.exam_start_at,
      er.exam_end_at,
      er.exam_time,
      er.time_taken,
      er.total_question,
      er.total_solve,
      er.total_unsolve,
      er.total_correct,
      er.status,
      er.created_at,
      er.updated_at,

      u.name,
      u.address,
      u.mobilenumber,
      u.username,

      sr.learning_center_name,
      sr.age

    FROM Exam_Result er

    LEFT JOIN users u
      ON er.user_id = u.id

    LEFT JOIN student_registration sr
      ON er.user_id = sr.user_id

    WHERE er.admin_id = ?
      AND (
        ? = ''
        OR u.name LIKE ?
        OR u.username LIKE ?
        OR u.mobilenumber LIKE ?
        OR er.exam_name LIKE ?
        OR er.exam_level LIKE ?
        OR sr.learning_center_name LIKE ?
      )

    ORDER BY
      er.exam_name ASC,
      er.exam_level ASC,
      er.total_correct DESC,
      er.total_solve DESC,
      er.time_taken ASC,
      er.id DESC

    LIMIT ?
    OFFSET ?
    `,
      [
        admin_id,
        search,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        Number(limit),
        Number(offset),
      ],
    );

    return buildPaginationResponse(rows, page, limit, totalRecords);
  },
  exportExamResultByAdminId: async (admin_id) => {
    const [rows] = await pool.query(
      `
    SELECT
      er.id,
      er.user_id,
      er.exam_id,
      er.admin_id,
      er.exam_name,
      er.exam_level,
      er.paper_set,
      er.date,
      er.exam_start_at,
      er.exam_end_at,
      er.exam_time,
      er.time_taken,
      er.total_question,
      er.total_solve,
      er.total_unsolve,
      er.total_correct,
      er.status,

      u.name,
      u.address,
      u.mobilenumber,
      u.username,

      sr.learning_center_name,
      sr.age

    FROM Exam_Result er

    LEFT JOIN users u
      ON er.user_id = u.id

    LEFT JOIN student_registration sr
      ON er.user_id = sr.user_id

    WHERE er.admin_id = ?

    ORDER BY
      er.exam_name ASC,
      er.exam_level ASC,
      er.total_correct DESC,
      er.total_solve DESC,
      er.time_taken ASC,
      er.id DESC
    `,
      [admin_id],
    );

    return rows;
  },
  getExamStatusList: (exam_id, level) => {
    let query = `
    SELECT 
      u.id AS user_id,
      u.name,
      u.username,
      u.mobilenumber,
      u.level,
      u.city_id,
      u.address,
      

      es.exam_title,
      es.exam_level,

      er.id AS result_id,
      er.exam_start_at,
      er.exam_end_at,
      er.exam_time,
      er.time_taken,
      er.total_question,
      er.total_solve,
      er.total_unsolve,
      er.total_correct,
      er.status,

      CASE 
        WHEN er.status = 'STARTED' THEN 'STARTED'
        WHEN er.status = 'SUBMITTED' THEN 'SUBMITTED'
        ELSE 'NOT STARTED'
      END AS exam_status

    FROM users u

    LEFT JOIN exam_schedule es 
      ON es.id = ?

    LEFT JOIN Exam_Result er 
      ON er.user_id = u.id 
      AND er.exam_id = es.id

    WHERE 1=1
  `;

    const params = [exam_id];

    // ✅ Level filter (important)
    if (level) {
      query += ` AND u.level = ?`;
      params.push(level);
    }

    // ✅ If you want ONLY users matching exam level
    query += ` AND (es.exam_level = u.level OR es.exam_level IS NULL)`;

    query += `
    ORDER BY 
      exam_status ASC,
      u.name ASC
  `;

    return pool.query(query, params);
  },
};
