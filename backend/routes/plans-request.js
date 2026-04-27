const express = require("express");
const router = express.Router();
const planRequestController = require("../controllers/plans-request-controller");

router.post("/", planRequestController.createRequest);

module.exports = router;
