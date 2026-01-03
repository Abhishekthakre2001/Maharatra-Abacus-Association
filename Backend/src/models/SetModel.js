const pool = require("../config/db");

module.exports = {
  create: (data) =>
    pool.query(
      "INSERT INTO sets (set_name, level_id, createdby) VALUES (?, ?, ?)",
      [data.set_name, data.level_id, data.createdby]
    ),

  findAll: () =>
    pool.query(
      "SELECT s.*, l.level FROM sets s JOIN levels l ON s.level_id = l.id"
    ),

  findById: (id) =>
    pool.query("SELECT * FROM sets WHERE id = ?", [id]),

  update: (id, data) =>
    pool.query(
      "UPDATE sets SET set_name=?, level_id=? WHERE id=?",
      [data.set_name, data.level_id, id]
    ),

  remove: (id) =>
    pool.query("DELETE FROM sets WHERE id = ?", [id])
};
