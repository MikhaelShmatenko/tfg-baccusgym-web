const db = require("../config/db");

class PlansModel {
  async getAllPlans() {
    const query = "SELECT * FROM plans ORDER BY idplan";
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = new PlansModel();
