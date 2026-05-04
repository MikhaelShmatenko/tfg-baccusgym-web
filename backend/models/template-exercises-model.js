const db = require("../config/db");

class TemplateExercisesModel {
  async addExercise(
    idtemplate,
    exercise_name,
    series,
    reps,
    resting_time,
    order_number,
  ) {
    const query = `
      INSERT INTO template_exercises (idtemplate, exercise_name, series, reps, resting_time, order_number)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const values = [
      idtemplate,
      exercise_name,
      series,
      reps,
      resting_time,
      order_number,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }
}

module.exports = new TemplateExercisesModel();
