const router = require("express").Router();
const controller = require("../controllers/ExamResultController");

router.get("/check", controller.checkExamStatus);
router.get("/", controller.getAll);
router.get("/examresult/:admin_id", controller.getexamresultByAdminId);
router.get("/student/:user_id", controller.getByStudentId);
router.get("/:id", controller.getById);

router.post("/start", controller.startExam);
router.put("/submit/:id", controller.submitExam);

router.delete("/:id", controller.remove);

router.get("/status/:exam_id", controller.getExamStatusList);

module.exports = router;