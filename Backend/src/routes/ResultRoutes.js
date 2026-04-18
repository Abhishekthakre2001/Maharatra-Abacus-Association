const router = require("express").Router();
const controller = require("../controllers/ResultController");

router.get("/check", controller.checkExamSubmission);
router.get("/all-results-excel/:id", controller.downloadResultsExcel);
router.get("/admin/:id", controller.getResultByAdminId);
router.get("/", controller.getAll);
router.post("/", controller.create);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;