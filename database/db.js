const mysql = require("mysql2");
const config = require('../config')

const databaseConfig = {
  host: config.host,
  database: config.database,
  user: config.user,
  password: config.password,
  multipleStatements: true,
	waitForConnections: true,
}

const connection =  mysql.createConnection(databaseConfig);

connection.connect((error) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log("CONECTADO A LA BASE DE DATOS!");
});

module.exports = connection;