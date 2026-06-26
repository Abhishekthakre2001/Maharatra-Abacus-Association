// routes/stateRoutes.js
const router = require("express").Router();
const controller = require("../controllers/StateController");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.get("/export", controller.exportData); 
router.delete("/:id", controller.remove);

module.exports = router;