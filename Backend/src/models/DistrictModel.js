const pool = require("../config/db");

module.exports = {
  create: (data) =>
    pool.query(
      `INSERT INTO districts (name, state_id, prant_id)
       VALUES (?, ?, ?)`,
      [data.name, data.state_id, data.prant_id]
    ),

  findAllPaginated: async (page = 1, limit = 10, search = "") => {
    const offset = (page - 1) * limit;

    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM districts
      WHERE (? = '' OR name LIKE ?)
      `,
      [search, `%${search}%`]
    );

    const totalRecords = countRows[0].total;

    const [rows] = await pool.query(
      `
      SELECT d.*, s.name AS state_name
      FROM districts d
      LEFT JOIN states s ON s.id = d.state_id
      WHERE (? = '' OR d.name LIKE ?)
      ORDER BY d.id DESC
      LIMIT ? OFFSET ?
      `,
      [search, `%${search}%`, Number(limit), Number(offset)]
    );

    return {
      data: rows,
      pagination: {
        total: totalRecords,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalRecords / limit),
      },
    };
  },

  findById: (id) =>
    pool.query(
      `
      SELECT d.*, s.name AS state_name
      FROM districts d
      LEFT JOIN states s ON s.id = d.state_id
      WHERE d.id = ?
      `,
      [id]
    ),

  update: (id, data) =>
    pool.query(
      `UPDATE districts SET name=?, state_id=?, prant_id=? WHERE id=?`,
      [data.name, data.state_id, data.prant_id, id]
    ),

  remove: (id) =>
    pool.query("DELETE FROM districts WHERE id = ?", [id]),

  exportAll: async (search = "") => {
    const [rows] = await pool.query(
      `
      SELECT d.*, s.name AS state_name
      FROM districts d
      LEFT JOIN states s ON s.id = d.state_id
      WHERE (? = '' OR d.name LIKE ?)
      ORDER BY d.id DESC
      `,
      [search, `%${search}%`]
    );

    return rows;
  },
};