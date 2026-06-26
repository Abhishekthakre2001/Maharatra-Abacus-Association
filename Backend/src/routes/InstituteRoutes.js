const router = require("express").Router();
const controller = require("../controllers/InstituteController");

router.get("/", controller.getAll);
router.get("/export", controller.exportData);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;