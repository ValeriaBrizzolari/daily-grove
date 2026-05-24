import pg from "pg";

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,

  user: process.env.DATABASE_URL ? undefined : "postgres",
  host: process.env.DATABASE_URL ? undefined : "localhost",
  database: process.env.DATABASE_URL ? undefined : "daily_grove",
  password: process.env.DATABASE_URL ? undefined : "Imafish1989",
  port: process.env.DATABASE_URL ? undefined : 5432,

  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

db.connect();

export default db;
