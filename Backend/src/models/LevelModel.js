const pool = require("../config/db");

module.exports = {
  create: (data) =>
    pool.query(
      "INSERT INTO levels (level, createdby) VALUES (?, ?)",
      [data.level, data.createdby]
    ),

  findByLevelAndUser: (level, createdby) =>
    pool.query(
      "SELECT * FROM levels WHERE level = ? AND createdby = ?",
      [level, createdby]
    ),

  findAll: () => pool.query("SELECT * FROM levels"),

  findById: (id) =>
    pool.query("SELECT * FROM levels WHERE id = ?", [id]),

    findAllByAdmin: (adminid) =>
    pool.query("SELECT * FROM levels WHERE createdby = ?", [adminid]),

  update: (id, data) =>
    pool.query(
      "UPDATE levels SET level = ? WHERE id = ?",
      [data.level, id]
    ),

  remove: (id) =>
    pool.query("DELETE FROM levels WHERE id = ?", [id])
};
