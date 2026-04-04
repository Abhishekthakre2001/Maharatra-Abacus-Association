const router = require("express").Router();
const controller = require("../controllers/ResultController");

router.get("/check", controller.checkExamSubmission);
router.get("/", controller.getAll);
router.post("/", controller.create);
// get by student id
router.get("/:id", controller.getById); 
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.get("/all-results-excel/:id", controller.downloadResultsExcel);



module.exports = router;
