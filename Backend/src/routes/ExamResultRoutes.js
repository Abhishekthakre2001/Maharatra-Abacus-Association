const router = require("express").Router();
const controller = require("../controllers/ExamResultController");
const allowedRoles = require("../middlewares/allowedRoles");
const verifyJwt = require("../middlewares/verifyJwt");

router.get("/check", controller.checkExamStatus);
router.get("/", controller.getAll);
router.get("/examresult/:admin_id", controller.getexamresultByAdminId);
router.get("/student/:user_id", controller.getByStudentId);
router.get("/:id", controller.getById);

router.post("/start", controller.startExam);
router.put("/submit/:id", controller.submitExam);

router.delete("/:id", controller.remove);

router.get("/status/:exam_id", controller.getExamStatusList);
router.get(
  "/export/:id",
  verifyJwt,
  allowedRoles("admin"),
  controller.exportExamResultByAdminId,
);
module.exports = router;
