const db = require("../config/db");

class TemplateModel {
  async createTemplate(name, description, type) {
    const query = `
      INSERT INTO templates (name, description, type) 
      VALUES ($1, $2, $3) 
      RETURNING *`;
    const values = [name, description, type];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async getTemplateById(idtemplate) {
    const query = "SELECT * FROM templates WHERE idtemplate = $1";
    const result = await db.query(query, [idtemplate]);
    return result.rows[0];
  }

  async getAllTemplatesWithExercises() {
    const query = `
    SELECT 
      t.idtemplate, t.name AS template_name, t.description, t.type,
      te.idtemplate_exercise, te.exercise_name, te.series, te.reps, te.resting_time, te.order_number
    FROM templates t
    LEFT JOIN template_exercises te ON t.idtemplate = te.idtemplate
    ORDER BY t.idtemplate ASC, te.order_number ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  async deleteTemplate(idtemplate) {
    const query = "DELETE FROM templates WHERE idtemplate = $1";
    await db.query(query, [idtemplate]);
  }
}

module.exports = new TemplateModel();
