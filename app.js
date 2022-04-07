//1. importando librerias
const express = require("express")                      // Libreria Express
const session = require("express-session")              // var de session
const { port } = require('./config')                    // Puerto del servidor
const connection = require("./database/db")             // Conexion de la BD

const app = express()

app.set('port', port)
var server = app.listen(app.get('port'), () => {
  console.log(`SERVER RUNNING IN http://localhost:${app.get('port')}`)
})

app.use(express.urlencoded({ extended: false }))   // seteamos urlencoded para capturar datos del formulario
app.use(express.json())                            // Analizar y convertir archivos JSON en objetos
app.use(express.static(__dirname + "/public"))     // el directorio public
app.use(session({ secret: "secret", resave: true, saveUninitialized: true }))

app.set("view engine", "ejs")           // estableciendo el motor de plantillas
app.set('views', __dirname + '/views')  // Directorio de las vistas

app.use("/", require("./routes"))       // Estableciendo las rutas del index

//  SOCKETS
let ides = new Map()
let mensajes = []
connection.query("SELECT * FROM mensajes ", async (error, results) => {
  // console.log(results)
  for (x of results) {
    mensajes.push({
      dniE: x.emisor_dni,
      msje: x.mensaje,
      dniR: x.receptor_dni,
    })
  }
  const SocketIO = require("socket.io")
  const io = SocketIO(server)
  io.on("connection", (socket) => {
    socket.on("conectar", (data) => {
      let mensajesDelchat = []
      for (mensaje of mensajes) {
        if (mensaje.dniE == data.dni || mensaje.dniR == data.dni) {
          mensajesDelchat.push(mensaje)
        }
      }
      ides.set(data.dni, socket.id)
      // console.log(data.dni, socket.id)
      io.to(socket.id).emit("inicio", mensajesDelchat)
    })
    socket.on("mensaje", (data) => {
      mensajes.push({
        dniE: data.dniE + "",
        msje: data.mensaje,
        dniR: data.dniR + "",
      })
      // console.log({ dniE: data.dniE + "", msje: data.mensaje, dniR: data.dniR + "" },ides.get(data.dniR + ""))
      io.to(ides.get(data.dniR)).emit("mensaje", {
        dniE: data.dniE + "",
        msje: data.mensaje,
        dniR: data.dniR + "",
      })
      connection.query(
        'INSERT INTO mensajes( mensaje,  emisor_dni, receptor_dni) VALUES ("' +
        (data.mensaje + "") +
        '", "' +
        (data.dniE + "") +
        '","' +
        (data.dniR + "") +
        '") ',
        async (error, results) => { }
      )
    })
  })
})