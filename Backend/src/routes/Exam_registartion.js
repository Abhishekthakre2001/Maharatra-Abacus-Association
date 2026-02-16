const express = require("express");
const router = express.Router();
const controller = require("../controllers/Exam_registartion");

router.post("/exam-registration", controller.examRegistration);
router.get("/createdby/:createdby", controller.getByCreatedBy);




module.exports = router;
