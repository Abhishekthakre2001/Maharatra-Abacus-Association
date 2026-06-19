const pool = require("../config/db");
const { buildPaginationResponse } = require("../utils/getPaginationParams");

module.exports = {
  create: (data) =>
    pool.query("INSERT INTO sets (set_name, createdby) VALUES (?, ?)", [
      data.set_name,
      data.createdby,
    ]),

  findBySetNameAndUser: (set_name, createdby) =>
    pool.query("SELECT * FROM sets WHERE set_name = ? AND createdby = ?", [
      set_name,
      createdby,
    ]),

  findAll: () => pool.query("SELECT * FROM sets"),

  findbyadminid: async (id, page = 1, limit = 5, search = "") => {
    const offset = (page - 1) * limit;

    // Count Query
    const [countRows] = await pool.query(
      `
    SELECT COUNT(*) AS total
    FROM sets

    WHERE createdby = ?
      AND (
        ? = ''
        OR set_name LIKE ?
      )
    `,
      [id, search, `%${search}%`],
    );

    const totalRecords = countRows[0].total;

    // Main Query
    const [rows] = await pool.query(
      `
    SELECT *
    FROM sets

    WHERE createdby = ?
      AND (
        ? = ''
        OR set_name LIKE ?
      )

    ORDER BY id DESC

    LIMIT ?
    OFFSET ?
    `,
      [id, search, `%${search}%`, Number(limit), Number(offset)],
    );

    return buildPaginationResponse(rows, page, limit, totalRecords);
  },

  findById: (id) => pool.query("SELECT * FROM sets WHERE id = ?", [id]),

  update: (id, data) =>
    pool.query("UPDATE sets SET set_name=? WHERE id=?", [data.set_name, id]),

  remove: (id) => pool.query("DELETE FROM sets WHERE id = ?", [id]),
};
