const mysql = require("mysql2");
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const connection =  mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE ||  "covidtrack",
  user: process.env.DB_NAME ||"root",
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