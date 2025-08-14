import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

export const database_connection = async () => {
  try {
    await pool.connect();
    console.log("PostgreSQL Connected Successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};
