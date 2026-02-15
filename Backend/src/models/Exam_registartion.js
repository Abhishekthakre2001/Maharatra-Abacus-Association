const pool = require("../config/db");

const ExamRegistration = {

  createWithTransaction: async (data) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const fullName =
        `${data.firstName} ${data.middleName} ${data.lastName}`.trim();
    
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
          data.username,
          data.password,
          data.level,
          data.dob,
          data.subscription_end_date,
          data.usertype,
          data.createdby,
          data.status ?? 0
        ]
      );

      const userId = userResult.insertId;

      // 2️⃣ Insert into student_registration table
      await connection.query(
        `INSERT INTO student_registration
        (user_id, student_name, date_of_birth,
         learning_center_name, city, address,
         level, registration_date,
         parent_name, whatsapp_number)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?)`,
        [
          userId,
          fullName,
          data.dob,
          data.learningCenter,
          data.city,
          data.address,
          data.level,
          data.parentName,
          data.whatsapp
        ]
      );

      await connection.commit();

      return { success: true, userId };

    } catch (error) {
      await connection.rollback();
      throw error;

    } finally {
      connection.release();
    }
  }

};

module.exports = ExamRegistration;
