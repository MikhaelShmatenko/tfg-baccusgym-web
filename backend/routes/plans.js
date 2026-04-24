var express = require("express");
var router = express.Router();
const plansController = require("../controllers/plans-controller");

router.get("/", plansController.getAllPlans);

module.exports = router;
