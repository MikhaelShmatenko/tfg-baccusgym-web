const ExerciseTutorialService = require("../services/exercise-tutorial-service");

const addExerciseTutorial = async (req, res) => {
  try {
    const { name, description } = req.body;
    const url_video = req.file ? req.file.filename : null;
    const tutorial = await ExerciseTutorialService.addExerciseTutorial({
      name,
      description,
      url_video,
    });
    res.status(201).json(tutorial);
  } catch (error) {
    if (error.message === "MISSING_FIELDS") {
      res.status(400).json({ message: "Faltan campos obligatorios" });
    } else {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
};

const getAllExerciseTutorials = async (req, res) => {
  try {
    const tutorials = await ExerciseTutorialService.getAllExerciseTutorials();
    res.status(200).json(tutorials);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const deleteExerciseTutorial = async (req, res) => {
  try {
    const { id } = req.params;
    await ExerciseTutorialService.deleteExerciseTutorial(id);
    res.status(200).json({ message: "Tutorial eliminado correctamente" });
  } catch (error) {
    if (error.message === "TUTORIAL_NOT_FOUND") {
      res.status(404).json({ message: "Tutorial no encontrado" });
    } else {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
};

module.exports = {
  addExerciseTutorial,
  getAllExerciseTutorials,
  deleteExerciseTutorial,
};
