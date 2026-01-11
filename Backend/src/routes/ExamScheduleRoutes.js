const router = require("express").Router();
const controller = require("../controllers/ExamScheduleController");

router.get("/", controller.getAll);
router.post("/", controller.create);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.get("/all/:id", controller.getByadmin);


module.exports = router;
