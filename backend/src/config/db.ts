import mysql from "mysql2/promise";
import { env } from "./env";

export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4",
  dateStrings: true, // DATE/DATETIME voltam como string 'YYYY-MM-DD', não Date do JS
  decimalNumbers: true, // DECIMAL volta como number, não string
});
