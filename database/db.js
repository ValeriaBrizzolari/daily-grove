import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "daily_grove",
  password: "Imafish1989",
  port: 5432,
});

db.connect();

export default db;
