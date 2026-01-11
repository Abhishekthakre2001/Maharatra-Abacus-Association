const express = require("express");
const router = express.Router();
const controller = require("../controllers/QuestionController");
// routes/questionRoutes.js
router.get("/level-wise-sets", controller.getLevelWiseSets);
// Bulk upload endpoint (CSV/JSON array of questions)
router.post("/bulk", controller.bulkCreateQuestions);
router.post("/", controller.createQuestion);
router.get("/", controller.getQuestions);
router.put("/updateset", controller.updateSet);
router.get("/admin/:id", controller.getQuestionsByAdmin);
router.get("/:id", controller.getQuestionById);
router.put("/:id", controller.updateQuestion);
router.delete("/:id", controller.deleteQuestion);
router.delete("/deleteset/level/:level/set/:set", controller.deleteSet);



module.exports = router;
