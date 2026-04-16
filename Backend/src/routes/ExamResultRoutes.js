const router = require("express").Router();
const controller = require("../controllers/ExamResultController");

router.get("/check", controller.checkExamStatus);
router.get("/", controller.getAll);
router.get("/student/:user_id", controller.getByStudentId);
router.get("/:id", controller.getById);

router.post("/start", controller.startExam);
router.put("/submit/:id", controller.submitExam);

router.delete("/:id", controller.remove);

module.exports = router;