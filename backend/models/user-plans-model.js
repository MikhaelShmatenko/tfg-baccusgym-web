const db = require("../config/db");

class UsersPlansModel {
  async linkUserToPlan(idUser, planId) {
    const query =
      "INSERT INTO user_plans (iduser, idplan, start_date, end_date, remaining_days, is_active) VALUES ($1, $2, null, null, null, false) RETURNING *";
    const values = [idUser, planId];
    const result = await db.query(query, values);
    return result.rows[0];
  }
}

module.exports = new UsersPlansModel();
