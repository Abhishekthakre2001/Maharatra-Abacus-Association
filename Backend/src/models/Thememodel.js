const pool = require("../config/db");

module.exports = {
  findById: (id) =>
    pool.query("SELECT * FROM ui_theme_colors WHERE user_id = ?", [id]),

};
