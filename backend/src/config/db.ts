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
  // Aiven (e a maioria dos MySQL gerenciados) recusa conexão sem TLS. Em
  // dev local (XAMPP) DB_SSL_CA não existe, então isso vira `undefined` e o
  // driver conecta sem TLS como sempre conectou.
  ssl: env.DB_SSL_CA ? { ca: env.DB_SSL_CA, rejectUnauthorized: true } : undefined,
});
