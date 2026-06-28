const pool = require("../config/db");

const RegistrationModel = {

    // Find User By Username
    findUserByUsername: async (username) => {

        const [rows] = await pool.query(
            `
      SELECT
        id,
        name,
        username
      FROM users
      WHERE username=?
      LIMIT 1
      `,
            [username]
        );

        return rows[0];
    },

    // Get Admin Setting
    getSettings: async (adminId) => {

        const [rows] = await pool.query(
            `
      SELECT *
      FROM admin_setting
      WHERE createdby=?
      LIMIT 1
      `,
            [adminId]
        );

        return rows[0] || {};
    },

    // Get Institutes
    getInstitutes: async (adminId) => {

        const [rows] = await pool.query(
            `
      SELECT
        id,
        institute_name,
        country_id,
        state_id,
        district_id,
        city
      FROM institutes
      WHERE created_by=?
      ORDER BY institute_name
      `,
            [adminId]
        );

        return rows;
    },


    // NEW
    getLevels: async (adminId) => {
        const [rows] = await pool.query(
            `
      SELECT
        id,
        level_name,
        level
      FROM levels
      WHERE createdby = ?
      ORDER BY level
      `,
            [adminId]
        );

        return rows;
    },

};

module.exports = RegistrationModel;