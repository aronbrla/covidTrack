//1. importando librerias
const express = require("express")                      // Libreria Express
const session = require("express-session")              // var de session
const { port } = require('./config')                    // Puerto del servidor
const connection = require("./database/db")             // Conexion de la BD

const app = express()

app.set('port', port)
const server = app.listen(app.get('port'), () => {
  console.log(`SERVER RUNNING IN http://localhost:${app.get('port')}`)
})

app.use(express.urlencoded({ extended: false }))   // seteamos urlencoded para capturar datos del formulario
app.use(express.json())                            // Analizar y convertir archivos JSON en objetos
app.use(express.static(__dirname + "/public"))     // el directorio public
app.use(session({ secret: "secret", resave: true, saveUninitialized: true }))

app.set("view engine", "ejs")           // estableciendo el motor de plantillas
app.set('views', __dirname + '/views')  // Directorio de las vistas

app.use("/", require("./routes"))       // Estableciendo las rutas del index

module.exports = { app, server }