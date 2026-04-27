const db = require("../config/db");

class PlansModel {
  async getAllPlans() {
    const query = "SELECT * FROM plans ORDER BY idplan";
    const result = await db.query(query);
    return result.rows;
  }

  async getPlanById(idPlan) {
    const query = "SELECT * FROM plans WHERE idplan = $1";
    const values = [idPlan];
    const result = await db.query(query, values);
    return result.rows[0];
  }
}

module.exports = new PlansModel();
