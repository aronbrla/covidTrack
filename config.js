require('dotenv').config()

module.exports = {
    port: process.env.PORT || 4000,
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "covidtrack",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
}