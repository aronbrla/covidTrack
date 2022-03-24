const mysql = require("mysql2");
require('dotenv').config()

const connection =  mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME ||  "covidtrack",
  user: process.env.DB_USER ||"root",
  password: process.env.DB_PASSWORD || "",
  multipleStatements: true,
	waitForConnections: true,
});
connection.connect((error) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log("CONECTADO A LA BASE DE DATOS!");
});

module.exports = connection;