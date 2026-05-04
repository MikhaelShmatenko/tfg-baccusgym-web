const TemplateExercisesService = require("../services/template-exercises-service");

const addExerciseToTemplate = async (req, res) => {
  try {
    const {
      idtemplate,
      exercise_name,
      series,
      reps,
      resting_time,
      order_number,
    } = req.body;

    if (!idtemplate || !exercise_name || !series || !reps) {
      return res
        .status(400)
        .json({ message: "Faltan campos obligatorios para el ejercicio" });
    }

    const exercise = await TemplateExercisesService.addExerciseToTemplate(
      idtemplate,
      exercise_name,
      series,
      reps,
      resting_time,
      order_number,
    );

    res.status(201).json(exercise);
  } catch (error) {
    if (error.message === "TEMPLATE_NOT_FOUND") {
      res
        .status(404)
        .json({ message: "La plantilla (ID) especificada no existe" });
    } else {
      res.status(500).json({ message: "Error interno al añadir el ejercicio" });
    }
  }
};

module.exports = {
  addExerciseToTemplate,
};
