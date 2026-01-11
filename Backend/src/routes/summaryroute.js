const express = require("express");
const router = express.Router();
const SummaryController = require("../controllers/SummaryController");

router.get("/:createdby", SummaryController.getSummary);

module.exports = router;
