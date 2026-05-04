const cron = require("node-cron");
const db = require("../config/db");

const startPlanCleanup = () => {
  cron.schedule("1 0 * * *", async () => {
    try {
      const query = `
        UPDATE user_plans 
        SET is_active = false 
        WHERE is_active = true 
          AND end_date IS NOT NULL 
          AND end_date < CURRENT_DATE
      `;
      const result = await db.query(query);
    } catch (error) {
      console.log("Error en la limpieza de planes");
    }
  });
};

module.exports = startPlanCleanup;
