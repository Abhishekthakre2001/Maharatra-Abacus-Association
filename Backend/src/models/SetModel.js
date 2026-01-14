const pool = require("../config/db");

module.exports = {
  create: (data) =>
    pool.query(
      "INSERT INTO sets (set_name, createdby) VALUES (?, ?)",
      [data.set_name, data.createdby]
    ),

  findBySetNameAndUser: (set_name, createdby) =>
    pool.query(
      "SELECT * FROM sets WHERE set_name = ? AND createdby = ?",
      [set_name, createdby]
    ),

  findAll: () =>
    pool.query(
      "SELECT * FROM sets"
    ),

  findbyadminid: (id) =>
    pool.query("SELECT * FROM sets WHERE createdby = ?", [id]),

  findById: (id) =>
    pool.query("SELECT * FROM sets WHERE id = ?", [id]),

  update: (id, data) =>
    pool.query(
      "UPDATE sets SET set_name=? WHERE id=?",
      [data.set_name, id]
    ),

  remove: (id) =>
    pool.query("DELETE FROM sets WHERE id = ?", [id])
};
