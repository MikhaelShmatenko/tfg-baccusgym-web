const db = require("../config/db");

class UsersModel {
  async addUser(userData) {
    const { name, email, password, admin } = userData;
    const query =
      "INSERT INTO users (name, email, password, admin) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [name, email, password, admin];
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

  async getUserFullDetails(idUser) {
    const query = `
    SELECT 
        u.name, 
        u.email, 
        up.start_date, 
        up.end_date, 
        up.is_active, 
        up.remaining_days, 
        p.name AS plan_name
    FROM users u
    LEFT JOIN user_plans up ON u.iduser = up.iduser
    LEFT JOIN plans p ON up.idplan = p.idplan
    WHERE u.iduser = $1
    `;
    const values = [idUser];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async getAllUsersFullDetails() {
    const query = `
    SELECT 
        u.iduser,
        u.name, 
        u.email, 
        up.start_date, 
        up.end_date, 
        up.is_active, 
        up.remaining_days, 
        p.name AS plan_name,
        p.type AS plan_type
    FROM users u
    LEFT JOIN user_plans up ON u.iduser = up.iduser
    LEFT JOIN plans p ON up.idplan = p.idplan
    ORDER BY u.name ASC
  `;
    const result = await db.query(query);
    return result.rows;
  }

  async deleteUser(idUser) {
    const queryPlans = "DELETE FROM user_plans WHERE iduser = $1";
    const valuesPlans = [idUser];
    await db.query(queryPlans, valuesPlans);

    const queryUser = "DELETE FROM users WHERE iduser = $1";
    const valuesUser = [idUser];
    const result = await db.query(queryUser, valuesUser);
    return result.rowCount > 0;
  }

  async findById(idUser) {
    const query = "SELECT * FROM users WHERE iduser = $1";
    const result = await db.query(query, [idUser]);
    return result.rows[0];
  }

  async updatePasswordById(idUser, newPassword) {
    const query = "UPDATE users SET password = $1 WHERE iduser = $2";
    await db.query(query, [newPassword, idUser]);
  }

  async updateName(idUser, newName) {
    const query =
      "UPDATE users SET name = $1 WHERE iduser = $2 RETURNING name, email";
    const result = await db.query(query, [newName, idUser]);
    return result.rows[0];
  }
}

module.exports = new UsersModel();
