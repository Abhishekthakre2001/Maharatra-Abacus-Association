const express = require("express");
const router = express.Router();
const controller = require("../controllers/QuestionController");
const verifyJwt = require("../middlewares/verifyJwt");
const allowedRoles = require("../middlewares/allowedRoles");
// routes/questionRoutes.js
router.get("/level-wise-sets", verifyJwt, allowedRoles('admin'), controller.getLevelWiseSets);
router.get(
  "/export/:id",
  verifyJwt,
  allowedRoles("admin"),
  controller.exportQuestionSet,
);
// routes/questionRoutes.js
router.get("/paperset", verifyJwt, allowedRoles('admin'), controller.getpaperset);
// Bulk upload endpoint (CSV/JSON array of questions)
router.post("/bulk", verifyJwt, allowedRoles('admin'), controller.bulkCreateQuestions);
router.post("/", verifyJwt, allowedRoles('admin'), controller.createQuestion);
router.get("/", verifyJwt, allowedRoles('admin'), controller.getQuestions);
router.put("/updateset", verifyJwt, allowedRoles('admin'), controller.updateSet);
router.get("/admin/:id", verifyJwt, allowedRoles('admin'), controller.getQuestionsByAdmin);
router.get("/:id", verifyJwt, allowedRoles('admin'), controller.getQuestionById);
router.put("/:id", verifyJwt, allowedRoles('admin'), controller.updateQuestion);
router.delete("/:id", verifyJwt, allowedRoles('admin'), controller.deleteQuestion);
router.delete("/deleteset/level/:level/set/:set", verifyJwt, allowedRoles('admin'), controller.deleteSet);



module.exports = router;
