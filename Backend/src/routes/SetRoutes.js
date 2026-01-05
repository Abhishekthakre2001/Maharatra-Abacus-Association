const router = require("express").Router();
const controller = require("../controllers/SetController");

router.get("/", controller.getAll);
router.get("/admin/:id", controller.getbyadminid);
router.post("/", controller.create);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
