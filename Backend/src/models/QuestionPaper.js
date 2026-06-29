const pool = require("../config/db");

const QuestionPaperModel = {

    // IMPORT
    importQuestions: async (data) => {
        const conn = await pool.getConnection();

        try {
            await conn.beginTransaction();

            const [paper] = await conn.query(
                `INSERT INTO question_papers
                (paper_name, level_id, set_id, duration, total_questions, negative_marking, paper_type, status, created_by)
                VALUES (?,?,?,?,?,?,?,?,?)`,
                [
                    data.paper_name,
                    data.level_id,
                    data.set_id,
                    data.duration,
                    data.questions.length,
                    0,
                    data.paper_type,
                    data.status,
                    data.created_by
                ]
            );

            const paperId = paper.insertId;

            const values = data.questions.map((q, i) => [
                paperId,
                q.section,
                i + 1,
                q.question_type,
                q.marks,
                q.negative_marks,
                q.question,
                q.option1,
                q.option2,
                q.option3,
                q.option4,
                q.correct_option,
                q.explanation,
                i + 1,
                data.created_by
            ]);

            await conn.query(
                `INSERT INTO question_paper_questions
                (question_paper_id, section, question_no, question_type, marks, negative_marks,
                question, option1, option2, option3, option4, correct_option, explanation, sort_order, created_by)
                VALUES ?`,
                [values]
            );

            await conn.commit();

            return { success: true, questionPaperId: paperId };

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    // GET PAPERS (OWN ONLY)
    getQuestionPapers: async (userId) => {
        const [rows] = await pool.query(
            `SELECT qp.*, l.level_name, s.set_name
             FROM question_papers qp
             LEFT JOIN levels l ON l.id = qp.level_id
             LEFT JOIN sets s ON s.id = qp.set_id
             WHERE qp.created_by = ?
             ORDER BY qp.id DESC`,
            [userId]
        );
        return rows;
    },

    // GET QUESTIONS (OWN ONLY)
    getQuestionsByPaper: async (paperId, userId) => {
        const [rows] = await pool.query(
            `SELECT q.*
             FROM question_paper_questions q
             INNER JOIN question_papers qp ON qp.id = q.question_paper_id
             WHERE q.question_paper_id = ? AND qp.created_by = ?
             ORDER BY q.sort_order ASC`,
            [paperId, userId]
        );
        return rows;
    },

    // UPDATE PAPER
    updateQuestionPaper: async (id, data, userId) => {
        const [result] = await pool.query(
            `UPDATE question_papers
             SET paper_name=?, level_id=?, set_id=?, duration=?, paper_type=?, status=?
             WHERE id=? AND created_by=?`,
            [
                data.paper_name,
                data.level_id,
                data.set_id,
                data.duration,
                data.paper_type,
                data.status,
                id,
                userId
            ]
        );
        return result;
    },

    // DELETE PAPER
    deleteQuestionPaper: async (id, userId) => {
        const [result] = await pool.query(
            `DELETE FROM question_papers WHERE id=? AND created_by=?`,
            [id, userId]
        );
        return result;
    },

    // DELETE QUESTION
    deleteQuestion: async (id, userId) => {
        const [result] = await pool.query(
            `DELETE q FROM question_paper_questions q
             INNER JOIN question_papers qp ON qp.id = q.question_paper_id
             WHERE q.id=? AND qp.created_by=?`,
            [id, userId]
        );
        return result;
    },

    // UPDATE QUESTION
    updateQuestion: async (id, data, userId) => {
        const [result] = await pool.query(
            `UPDATE question_paper_questions q
             INNER JOIN question_papers qp ON qp.id = q.question_paper_id
             SET q.section=?, q.question_type=?, q.marks=?, q.negative_marks=?,
                 q.question=?, q.option1=?, q.option2=?, q.option3=?, q.option4=?,
                 q.correct_option=?, q.explanation=?
             WHERE q.id=? AND qp.created_by=?`,
            [
                data.section,
                data.question_type,
                data.marks,
                data.negative_marks,
                data.question,
                data.option1,
                data.option2,
                data.option3,
                data.option4,
                data.correct_option,
                data.explanation,
                id,
                userId
            ]
        );
        return result;
    }
};

module.exports = QuestionPaperModel;