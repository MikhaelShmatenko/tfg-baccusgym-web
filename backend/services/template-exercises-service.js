const TemplateExercisesModel = require("../models/template-exercises-model");
const TemplateModel = require("../models/template-model"); // Importamos para validar

class TemplateExercisesService {
  async addExerciseToTemplate(
    idtemplate,
    exercise_name,
    series,
    reps,
    resting_time,
    order_number,
  ) {
    try {
      const templateExists = await TemplateModel.getTemplateById(idtemplate);

      if (!templateExists) {
        throw new Error("TEMPLATE_NOT_FOUND");
      }

      const newExercise = await TemplateExercisesModel.addExercise(
        idtemplate,
        exercise_name,
        series,
        reps,
        resting_time,
        order_number,
      );

      return newExercise;
    } catch (error) {
      if (error.message === "TEMPLATE_NOT_FOUND") {
        throw error;
      }
      throw new Error("EXERCISE_CREATION_FAILED");
    }
  }
}

module.exports = new TemplateExercisesService();
