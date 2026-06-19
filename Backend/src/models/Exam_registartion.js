const pool = require("../config/db");
const { buildPaginationResponse } = require("../utils/getPaginationParams");

const ExamRegistration = {
  createWithTransaction: async (data) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const fullName =
        `${data.firstName} ${data.middleName} ${data.lastName}`.trim();

      const username = data.username?.trim();
      const password = data.password?.trim();

      // 1️⃣ Insert into users table
      const [userResult] = await connection.query(
        `INSERT INTO users
        (name, class, address, mobilenumber, username, password,
         level, dob, subscription_end_date, usertype, createdby, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          fullName,
          data.class,
          data.address,
          data.mobile,
          username,
          password,
          data.level,
          data.dob,
          data.subscription_end_date,
          data.usertype,
          data.createdby,
          data.status ?? 0,
        ],
      );

      const userId = userResult.insertId;

      // 2️⃣ Insert into student_registration table
      await connection.query(
        `INSERT INTO student_registration
        (user_id, student_name, date_of_birth,
         learning_center_name, city, address,
         level, registration_date,
         parent_name, whatsapp_number, age)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)`,
        [
          userId,
          fullName,
          data.dob,
          data.learningCenter,
          data.city,
          data.address,
          data.level,
          data.parentName,
          data.whatsapp,
          data.age,
        ],
      );

      await connection.commit();

      return { success: true, userId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // ✅ FIXED — now inside same object
  // getByCreatedBy: async (createdby) => {
  //   const connection = await pool.getConnection();

  //   try {

  //     const [rows] = await connection.query(`
  //     SELECT
  //       u.id AS user_id,
  //       u.name,
  //       u.class,
  //       u.address,
  //       u.mobilenumber,
  //       u.username,
  //       u.level,
  //       u.dob,
  //       u.subscription_end_date,
  //       u.usertype,
  //       u.status,

  //       s.learning_center_name,
  //       s.city,
  //       s.parent_name,
  //       s.whatsapp_number,
  //       s.registration_date

  //     FROM users u
  //     INNER JOIN student_registration s
  //     ON u.id = s.user_id,

  //     WHERE u.createdby = ?
  //     ORDER BY s.registration_date DESC
  //   `, [createdby]);

  //     return rows;

  //   } finally {
  //     connection.release();
  //   }
  // }

  getByCreatedBy: async (createdby, page = 1, limit = 5, search = "") => {
    const connection = await pool.getConnection();

    try {
      const offset = (page - 1) * limit;

      // Count Query
      const [countRows] = await connection.query(
        `
                SELECT COUNT(*) AS total

                FROM users u

                INNER JOIN student_registration s
                    ON u.id = s.user_id

                WHERE u.createdby = ?
                  AND (
                        ? = ''
                        OR u.name LIKE ?
                        OR u.username LIKE ?
                        OR u.mobilenumber LIKE ?
                        OR s.parent_name LIKE ?
                        OR s.city LIKE ?
                        OR s.learning_center_name LIKE ?
                        OR u.class LIKE ?
                  )
                `,
        [
          createdby,
          search,
          `%${search}%`,
          `%${search}%`,
          `%${search}%`,
          `%${search}%`,
          `%${search}%`,
          `%${search}%`,
          `%${search}%`,
        ],
      );

      const totalRecords = countRows[0].total;

      // Main Query
      const [rows] = await connection.query(
        `
                SELECT 
                    u.id AS user_id,
                    u.name,
                    u.class,
                    u.address,
                    u.mobilenumber,
                    u.username,
                    u.password,
                    u.level,
                    u.dob,
                    u.subscription_end_date,
                    u.usertype,
                    u.status,

                    s.age,
                    s.learning_center_name,
                    s.city,
                    s.parent_name,
                    s.whatsapp_number,
                    s.registration_date

                FROM users u

                INNER JOIN student_registration s
                    ON u.id = s.user_id

                WHERE u.createdby = ?
                  AND (
                        ? = ''
                        OR u.name LIKE ?
                        OR u.username LIKE ?
                        OR u.mobilenumber LIKE ?
                        OR s.parent_name LIKE ?
                        OR s.city LIKE ?
                        OR s.learning_center_name LIKE ?
                        OR u.class LIKE ?
                  )

                ORDER BY
                    s.registration_date DESC

                LIMIT ?
                OFFSET ?
                `,
        [
          createdby,
          search,
          `%${search}%`,
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
    } finally {
      connection.release();
    }
  },
};

module.exports = ExamRegistration;
