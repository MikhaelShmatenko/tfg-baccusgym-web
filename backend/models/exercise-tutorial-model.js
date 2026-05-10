const db = require("../config/db");

class ExerciseTutorialModel {
  async addExerciseTutorial({ name, description, url_video }) {
    const query =
      "INSERT INTO exercise_tutorials (name, description, url_video) VALUES ($1, $2, $3) RETURNING *";
    const values = [name, description, url_video];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async getAllExerciseTutorials() {
    const query = "SELECT * FROM exercise_tutorials ORDER BY id ASC";
    const result = await db.query(query);
    return result.rows;
  }

  async getExerciseTutorialById(id) {
    const query = "SELECT * FROM exercise_tutorials WHERE id = $1";
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  async deleteExerciseTutorial(id) {
    const query = "DELETE FROM exercise_tutorials WHERE id = $1";
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }
}

module.exports = new ExerciseTutorialModel();
