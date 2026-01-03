const pool = require("../config/db");

module.exports = {
  create: (data) =>
    pool.query(
      `INSERT INTO admin_setting (
        admin_id,
        primary_main_color, primary_light_color, primary_dark_color,
        secondary_main_color, secondary_light_color, secondary_dark_color,
        neutral_main_color, neutral_light_color, neutral_dark_color,
        semantic_main_color, semantic_light_color, semantic_dark_color,
        logo_url, disk_space, result_page_visibility, createdby
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.admin_id,
        data.primary_main_color,
        data.primary_light_color,
        data.primary_dark_color,
        data.secondary_main_color,
        data.secondary_light_color,
        data.secondary_dark_color,
        data.neutral_main_color,
        data.neutral_light_color,
        data.neutral_dark_color,
        data.semantic_main_color,
        data.semantic_light_color,
        data.semantic_dark_color,
        data.logo_url,
        data.disk_space,
        data.result_page_visibility,
        data.createdby
      ]
    ),

  findAll: () =>
    pool.query(`
      SELECT a.*, u.name AS admin_name
      FROM admin_setting a
      JOIN users u ON a.admin_id = u.id
    `),

  findById: (id) =>
    pool.query("SELECT * FROM admin_setting WHERE id = ?", [id]),

  update: (id, data) =>
    pool.query(
      `UPDATE admin_setting SET
        primary_main_color=?,
        primary_light_color=?,
        primary_dark_color=?,
        secondary_main_color=?,
        secondary_light_color=?,
        secondary_dark_color=?,
        neutral_main_color=?,
        neutral_light_color=?,
        neutral_dark_color=?,
        semantic_main_color=?,
        semantic_light_color=?,
        semantic_dark_color=?,
        logo_url=?,
        disk_space=?,
        result_page_visibility=?
      WHERE id=?`,
      [
        data.primary_main_color,
        data.primary_light_color,
        data.primary_dark_color,
        data.secondary_main_color,
        data.secondary_light_color,
        data.secondary_dark_color,
        data.neutral_main_color,
        data.neutral_light_color,
        data.neutral_dark_color,
        data.semantic_main_color,
        data.semantic_light_color,
        data.semantic_dark_color,
        data.logo_url,
        data.disk_space,
        data.result_page_visibility,
        id
      ]
    ),

  remove: (id) =>
    pool.query("DELETE FROM admin_setting WHERE id = ?", [id])
};