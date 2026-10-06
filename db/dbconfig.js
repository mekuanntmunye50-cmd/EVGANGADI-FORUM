const mysql2 = require("mysql2");

const dbconnections = mysql2.createPool({
  user: "yared",
  database: "evangadi_db",
  host: "localhost",
  password: "123456",
  connectionLimit: 10
});

module.exports = dbconnections.promise();