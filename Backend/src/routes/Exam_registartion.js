const express = require("express");
const router = express.Router();
const controller = require("../controllers/Exam_registartion");
const verifyJwt = require("../middlewares/verifyJwt");
const allowedRoles = require("../middlewares/allowedRoles");

router.post("/exam-registration", controller.examRegistration);

router.get("/createdby/:createdby", controller.getByCreatedBy);
router.get(
  "/export/:createdby",
  verifyJwt,
  allowedRoles("admin"),
  controller.exportExamRegistrationData,
);
module.exports = router;
