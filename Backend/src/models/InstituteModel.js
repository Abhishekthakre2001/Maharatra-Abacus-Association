const pool = require("../config/db");

module.exports = {
  // CREATE
  create: (data) =>
    pool.query(
      `INSERT INTO institutes 
      (institute_name, institute_contact, country_id, state_id, district_id, city, address, pincode, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.institute_name,
        data.institute_contact,
        data.country_id,
        data.state_id,
        data.district_id,
        data.city,
        data.address,
        data.pincode,
        data.is_active ?? 1,
      ]
    ),

  // PAGINATION + SEARCH
  findAllPaginated: async (page = 1, limit = 10, search = "") => {
    const offset = (page - 1) * limit;

    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM institutes
      WHERE (? = '' OR institute_name LIKE ? OR city LIKE ?)
      `,
      [search, `%${search}%`, `%${search}%`]
    );

    const totalRecords = countRows[0].total;

    const [rows] = await pool.query(
      `
      SELECT i.*,
             c.name AS country_name,
             s.name AS state_name,
             d.name AS district_name
      FROM institutes i
      LEFT JOIN countries c ON c.id = i.country_id
      LEFT JOIN states s ON s.id = i.state_id
      LEFT JOIN districts d ON d.id = i.district_id
      WHERE (? = '' OR i.institute_name LIKE ? OR i.city LIKE ?)
      ORDER BY i.id DESC
      LIMIT ? OFFSET ?
      `,
      [search, `%${search}%`, `%${search}%`, Number(limit), Number(offset)]
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

  // GET BY ID
  findById: (id) =>
    pool.query(
      `
      SELECT i.*,
             c.name AS country_name,
             s.name AS state_name,
             d.name AS district_name
      FROM institutes i
      LEFT JOIN countries c ON c.id = i.country_id
      LEFT JOIN states s ON s.id = i.state_id
      LEFT JOIN districts d ON d.id = i.district_id
      WHERE i.id = ?
      `,
      [id]
    ),

  // UPDATE
  update: (id, data) =>
    pool.query(
      `UPDATE institutes SET
        institute_name=?,
        institute_contact=?,
        country_id=?,
        state_id=?,
        district_id=?,
        city=?,
        address=?,
        pincode=?,
        is_active=?
      WHERE id=?`,
      [
        data.institute_name,
        data.institute_contact,
        data.country_id,
        data.state_id,
        data.district_id,
        data.city,
        data.address,
        data.pincode,
        data.is_active,
        id,
      ]
    ),

  // DELETE
  remove: (id) =>
    pool.query("DELETE FROM institutes WHERE id = ?", [id]),

  // EXPORT
  exportAll: async (search = "") => {
    const [rows] = await pool.query(
      `
      SELECT i.*,
             c.name AS country_name,
             s.name AS state_name,
             d.name AS district_name
      FROM institutes i
      LEFT JOIN countries c ON c.id = i.country_id
      LEFT JOIN states s ON s.id = i.state_id
      LEFT JOIN districts d ON d.id = i.district_id
      WHERE (? = '' OR i.institute_name LIKE ? OR i.city LIKE ?)
      ORDER BY i.id DESC
      `,
      [search, `%${search}%`, `%${search}%`]
    );

    return rows;
  },
};