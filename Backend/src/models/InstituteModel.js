const pool = require("../config/db");

module.exports = {
  // CREATE
  create: (data) =>
    pool.query(
      `INSERT INTO institutes
      (
        institute_name,
        institute_contact,
        country_id,
        state_id,
        district_id,
        city,
        address,
        pincode,
        is_active,
        created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        data.created_by,
      ]
    ),

  // GET ALL
  findAllPaginated: async (
    adminId,
    page = 1,
    limit = 10,
    search = ""
  ) => {
    const offset = (page - 1) * limit;

    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) total
      FROM institutes
      WHERE created_by=?
      AND (?='' OR institute_name LIKE ? OR city LIKE ?)
      `,
      [
        adminId,
        search,
        `%${search}%`,
        `%${search}%`,
      ]
    );

    const totalRecords = countRows[0].total;

    const [rows] = await pool.query(
      `
      SELECT
        i.*,
        c.name country_name,
        s.name state_name,
        d.name district_name
      FROM institutes i
      LEFT JOIN countries c ON c.id=i.country_id
      LEFT JOIN states s ON s.id=i.state_id
      LEFT JOIN districts d ON d.id=i.district_id
      WHERE i.created_by=?
      AND (?='' OR i.institute_name LIKE ? OR i.city LIKE ?)
      ORDER BY i.id DESC
      LIMIT ? OFFSET ?
      `,
      [
        adminId,
        search,
        `%${search}%`,
        `%${search}%`,
        Number(limit),
        Number(offset),
      ]
    );

    return {
      data: rows,
      pagination: {
        totalRecords,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalRecords / limit),
      },
    };
  },

  // GET BY ID
  findById: (id, adminId) =>
    pool.query(
      `
      SELECT
        i.*,
        c.name country_name,
        s.name state_name,
        d.name district_name
      FROM institutes i
      LEFT JOIN countries c ON c.id=i.country_id
      LEFT JOIN states s ON s.id=i.state_id
      LEFT JOIN districts d ON d.id=i.district_id
      WHERE i.id=?
      AND i.created_by=?
      `,
      [id, adminId]
    ),

  // UPDATE
  update: (id, adminId, data) =>
    pool.query(
      `
      UPDATE institutes
      SET
        institute_name=?,
        institute_contact=?,
        country_id=?,
        state_id=?,
        district_id=?,
        city=?,
        address=?,
        pincode=?,
        is_active=?
      WHERE id=?
      AND created_by=?
      `,
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
        adminId,
      ]
    ),

  // DELETE
  remove: (id, adminId) =>
    pool.query(
      `
      DELETE FROM institutes
      WHERE id=?
      AND created_by=?
      `,
      [id, adminId]
    ),

  // EXPORT
  exportAll: async (adminId, search = "") => {
    const [rows] = await pool.query(
      `
      SELECT
        i.*,
        c.name country_name,
        s.name state_name,
        d.name district_name
      FROM institutes i
      LEFT JOIN countries c ON c.id=i.country_id
      LEFT JOIN states s ON s.id=i.state_id
      LEFT JOIN districts d ON d.id=i.district_id
      WHERE i.created_by=?
      AND (?='' OR i.institute_name LIKE ? OR i.city LIKE ?)
      ORDER BY i.id DESC
      `,
      [
        adminId,
        search,
        `%${search}%`,
        `%${search}%`,
      ]
    );

    return rows;
  },
};