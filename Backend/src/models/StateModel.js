const pool = require("../config/db");

module.exports = {
  create: (data) =>
    pool.query(
      `INSERT INTO states 
    (country_id, name, description, code, image, is_active, zone_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.country_id,
        data.name,
        data.description,
        data.code,
        data.image,
        data.is_active ?? 1,
        data.zone_id,
      ]
    ),

  // ✅ PAGINATION + SEARCH
  findAllPaginated: async (page = 1, limit = 10, search = "") => {
    const offset = (page - 1) * limit;

    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM states
      WHERE (? = '' OR name LIKE ?)
      `,
      [search, `%${search}%`]
    );

    const totalRecords = countRows[0].total;

    const [rows] = await pool.query(
      `
      SELECT s.*, c.name AS country_name
      FROM states s
      LEFT JOIN countries c ON c.id = s.country_id
      WHERE (? = '' OR s.name LIKE ?)
      ORDER BY s.id DESC
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
      SELECT s.*, c.name AS country_name
      FROM states s
      LEFT JOIN countries c ON c.id = s.country_id
      WHERE s.id = ?
      `,
      [id]
    ),

  update: (id, data) =>
    pool.query(
      `UPDATE states SET 
      country_id=?,
      name=?,
      description=?,
      code=?,
      image=?,
      is_active=?,
      zone_id=?
    WHERE id=?`,
      [
        data.country_id,
        data.name,
        data.description,
        data.code,
        data.image,
        data.is_active,
        data.zone_id,
        id,
      ]
    ),

  remove: (id) =>
    pool.query("DELETE FROM states WHERE id = ?", [id]),

  // ✅ EXPORT ALL
  exportAll: async (search = "") => {
    const [rows] = await pool.query(
      `
      SELECT s.*, c.name AS country_name
      FROM states s
      LEFT JOIN countries c ON c.id = s.country_id
      WHERE (? = '' OR s.name LIKE ?)
      ORDER BY s.id DESC
      `,
      [search, `%${search}%`]
    );

    return rows;
  },
};