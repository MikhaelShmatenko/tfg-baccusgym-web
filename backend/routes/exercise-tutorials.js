const express = require("express");
const router = express.Router();
const exerciseTutorialController = require("../controllers/exercise-tutorial-controller");

router.get("/all-exercise-tutorials", exerciseTutorialController.getAllExerciseTutorials);

module.exports = router;
