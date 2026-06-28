const router = require("express").Router();
const controller = require("../controllers/RegistartionController");


router.get("/registration/:username", controller.getRegistrationData);

module.exports = router;