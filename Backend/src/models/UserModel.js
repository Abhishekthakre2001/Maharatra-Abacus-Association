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

  update: async (id, data) => {
    const sql = `
      UPDATE users SET
      name=?, class=?, address=?, mobilenumber=?, level=?, dob=?, subscription_end_date=?, usertype=?, status=?
      WHERE id=?
    `;
    const [result] = await pool.query(sql, [
      data.name,
      data.class,
      data.address,
      data.mobilenumber,
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
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return result;
  }
};

module.exports = UserModel;
