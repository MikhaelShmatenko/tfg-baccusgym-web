const db = require("../config/db");

class UsersPlansModel {
  async linkUserToPlan(idUser, planId) {
    const query =
      "INSERT INTO user_plans (iduser, idplan, start_date, end_date, remaining_days, is_active) VALUES ($1, $2, null, null, null, false) RETURNING *";
    const values = [idUser, planId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async updateUserPlan(
    iduser,
    idplan,
    start_date,
    end_date,
    remaining_days,
    is_active,
  ) {
    const query = `
      UPDATE user_plans 
      SET idplan = $2, start_date = $3, end_date = $4, remaining_days = $5, is_active = $6
      WHERE iduser = $1
      RETURNING *`;
    const values = [
      iduser,
      idplan,
      start_date,
      end_date,
      remaining_days,
      is_active,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async substractRemainingDays(idUser) {
    const query = `
      UPDATE user_plans
      SET remaining_days = remaining_days - 1,
          is_active = CASE WHEN (remaining_days - 1) <= 0 THEN false ELSE is_active END
      WHERE iduser = $1 AND remaining_days > 0
      RETURNING *`;

    const result = await db.query(query, [idUser]);
    return result.rows[0];
  }

  async deactivateUserPlan(idUser) {
    const query = `
    UPDATE user_plans 
    SET is_active = false, 
        start_date = null, 
        end_date = null, 
        remaining_days = null
    WHERE iduser = $1
    RETURNING *`;
    const result = await db.query(query, [idUser]);
    return result.rows[0];
  }
}

module.exports = new UsersPlansModel();
