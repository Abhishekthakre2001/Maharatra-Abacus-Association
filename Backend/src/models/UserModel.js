const pool = require("../config/db");

const UserModel = {
  create: async (data) => {
    const sql = `
    INSERT INTO users
    (name, class, address, mobilenumber, username, password,
     level, dob, subscription_end_date, usertype, createdby, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const [result] = await pool.query(sql, [
      data.name,
      data.class,
      data.address,
      data.mobilenumber,
      data.username,
      data.password,
      data.level,
      data.dob,
      data.subscription_end_date,
      data.usertype,
      data.createdby,
      data.status ?? 1
    ]);

    return result;
  },
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  },

  // findByadminId: async (id) => {
  //   const [rows] = await pool.query("SELECT * FROM users WHERE createdby = ? && usertype= 'student'", [id]);
  //   return rows;
  // },
  findByadminId: async (id) => {
    const [rows] = await pool.query(
      `SELECT 
      u.*, 
      l.level_name
    FROM users u
    LEFT JOIN levels l 
      ON u.level = l.level 
      AND u.createdby = l.createdby
    WHERE u.createdby = ? 
      AND u.usertype = 'student'`,
      [id]
    );

    return rows;
  },
  
  update: async (id, data) => {
    const sql = `
      UPDATE users SET
      name=?, class=?, address=?, mobilenumber=?, username=?, password= ?, level=?, dob=?, subscription_end_date=?, usertype=?, status=?
      WHERE id=?
    `;
    const [result] = await pool.query(sql, [
      data.name,
      data.class,
      data.address,
      data.mobilenumber,
      data.username,
      data.password,
      data.level,
      data.dob,
      data.subscription_end_date,
      data.usertype,
      data.status,
      id
    ]);
    return result;
  },

  remove: async (id) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1️⃣ Delete child records first
      await connection.query(
        "DELETE FROM result WHERE user_id = ?",
        [id]
      );

      // 2️⃣ Delete parent record
      const [userResult] = await connection.query(
        "DELETE FROM users WHERE id = ?",
        [id]
      );

      await connection.commit();
      return userResult;

    } catch (error) {
      await connection.rollback();
      throw error;

    } finally {
      connection.release();
    }
  },


  findByUsername: async (username) => {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE BINARY username = ?",
      [username]
    );

    return rows[0];
  }



};

module.exports = UserModel;
