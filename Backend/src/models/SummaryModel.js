const pool = require("../config/db"); // adjust path if needed

exports.getSummary = async (createdby) => {

  /* 1️⃣ Question summary (set-wise) */
  const [setWise] = await pool.query(
    `
    SELECT 
      level,
      set_id,
      COUNT(*) AS question_count
    FROM questions
    WHERE createdby = ?
    GROUP BY level, set_id
    `,
    [createdby]
  );

  /* total questions */
  const [[totalQuestions]] = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM questions
    WHERE createdby = ?
    `,
    [createdby]
  );

  /* total unique sets (1A, 1B, etc.) */
  const [[totalSets]] = await pool.query(
    `
    SELECT COUNT(DISTINCT CONCAT(level, set_id)) AS total
    FROM questions
    WHERE createdby = ?
    `,
    [createdby]
  );

  /* 2️⃣ Students count */
  const [[students]] = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM users
    WHERE usertype = 'student'
      AND createdby = ?
    `,
    [createdby]
  );

  /* 3️⃣ Levels count */
  const [[levels]] = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM levels
    WHERE createdby = ?
    `,
    [createdby]
  );

  /* 4️⃣ Upcoming exams (today + future) */
  const [[exams]] = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM exam_schedule
    WHERE createdby = ?
      AND date >= CURDATE()
    `,
    [createdby]
  );

  return {
    questions: {
      total_questions: totalQuestions.total,
      total_sets: totalSets.total,
      set_wise: setWise
    },
    students: {
      total_students: students.total
    },
    levels: {
      total_levels: levels.total
    },
    exams: {
      upcoming_exams: exams.total
    }
  };
};
