const pool = require("../config/db");
const { buildPaginationResponse } = require("../utils/getPaginationParams");

module.exports = {
  create: (data) =>
    pool.query(
      "INSERT INTO levels (level, level_name, createdby) VALUES (?, ?, ?)",
      [data.level, data.level_name, data.createdby],
    ),

  findByLevelAndUser: (level, createdby) =>
    pool.query("SELECT * FROM levels WHERE level = ? AND createdby = ?", [
      level,
      createdby,
    ]),

  findAll: () => pool.query("SELECT * FROM levels"),

  findById: (id) => pool.query("SELECT * FROM levels WHERE id = ?", [id]),

  findAllByAdmin: async (adminid, page = 1, limit = 5, search = "") => {
    const offset = (page - 1) * limit;

    // Total Count
    const [countRows] = await pool.query(
      `
    SELECT COUNT(*) AS total
    FROM levels

    WHERE createdby = ?
      AND (
        ? = ''
        OR level LIKE ?
        OR level_name LIKE ?
      )
    `,
      [adminid, search, `%${search}%`, `%${search}%`],
    );

    const totalRecords = countRows[0].total;

    // Main Data
    const [rows] = await pool.query(
      `
    SELECT *
    FROM levels

    WHERE createdby = ?
      AND (
        ? = ''
        OR level LIKE ?
        OR level_name LIKE ?
      )

    ORDER BY id DESC

    LIMIT ?
    OFFSET ?
    `,
      [
        adminid,
        search,
        `%${search}%`,
        `%${search}%`,
        Number(limit),
        Number(offset),
      ],
    );

    return buildPaginationResponse(rows, page, limit, totalRecords);
  },

  update: (id, data) =>
    pool.query("UPDATE levels SET level = ?, level_name = ?  WHERE id = ?", [
      data.level,
      data.level_name,
      id,
    ]),

  remove: (id) => pool.query("DELETE FROM levels WHERE id = ?", [id]),
};
