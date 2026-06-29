const QuestionPaperModel = require("../models/QuestionPaper");

module.exports = {
    importQuestions: (data) =>
        QuestionPaperModel.importQuestions(data),

    getQuestionPapers: (userId) =>
        QuestionPaperModel.getQuestionPapers(userId),

    getQuestionsByPaper: (paperId, userId) =>
        QuestionPaperModel.getQuestionsByPaper(paperId, userId),

    updateQuestionPaper: (id, data, userId) =>
        QuestionPaperModel.updateQuestionPaper(id, data, userId),

    deleteQuestionPaper: (id, userId) =>
        QuestionPaperModel.deleteQuestionPaper(id, userId),

    deleteQuestion: (id, userId) =>
        QuestionPaperModel.deleteQuestion(id, userId),

    updateQuestion: (id, data, userId) =>
        QuestionPaperModel.updateQuestion(id, data, userId),
};