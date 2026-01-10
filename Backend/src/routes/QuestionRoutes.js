const express = require("express");
const router = express.Router();
const controller = require("../controllers/QuestionController");
// Bulk upload endpoint (CSV/JSON array of questions)
router.post("/bulk", controller.bulkCreateQuestions);
router.post("/", controller.createQuestion);
router.get("/", controller.getQuestions);
router.get("/admin/:id", controller.getQuestionsByAdmin);
router.get("/:id", controller.getQuestionById);
router.put("/:id", controller.updateQuestion);
router.delete("/:id", controller.deleteQuestion);

module.exports = router;
