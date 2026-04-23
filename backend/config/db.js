const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DB_PORT,
});

// pool.on("connect", () => {
//   console.log("Conexión a la base de datos PostgreSQL establecida");
// });

// pool.query("SELECT NOW()", (err, res) => {
//   if (err) {
//     console.error("❌ Error conectando a la DB:", err.stack);
//   } else {
//     console.log("✅ Conexión establecida con éxito a las:", res.rows[0].now);
//   }
// });

module.exports = pool;
