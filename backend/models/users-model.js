const db = require("../config/db");

class UsersModel {
  async addUser(userData) {
    const { name, email, password, admin, planStatus, idPlan } = userData;
    const query =
      "INSERT INTO users (name, email, password, admin, planstatus, idplan) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const values = [name, email, password, admin, planStatus, idPlan];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async updatePassword(email, newPassword) {
    const query = "UPDATE users SET password = $1 WHERE email = $2";
    const values = [newPassword, email];
    await db.query(query, values);
  }
}

module.exports = new UsersModel();
