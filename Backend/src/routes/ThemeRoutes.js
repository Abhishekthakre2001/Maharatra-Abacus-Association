const router = require("express").Router();
const controller = require("../controllers/ThemeController");

router.get("/:id", controller.getById);


module.exports = router;
