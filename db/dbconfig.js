require("dotenv").config();

const mysql2 = require("mysql2");

const dbconnections = mysql2.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "yared",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "evangadi_db",
  port: Number(process.env.DB_PORT || 3306),
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  waitForConnections: true,
  queueLimit: 0
});

module.exports = dbconnections.promise();