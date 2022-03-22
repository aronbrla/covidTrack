//1. importando librerias
const express = require("express");           // Libreria Express
const session = require("express-session");   // var de session

const connection = require("./database/db");  // Conexion de la BD

const app = express();

var server = app.listen(port = process.env.PORT || 3000, () => {
  console.log(`SERVER RUNNING IN http://localhost:${port}`);
});

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//2. seteamos urlencoded para capturar datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//4 el directorio public
app.use("/resources", express.static("public"));
app.use("resources", express.static(__dirname + "public"));

//5. estableciendo el motor de plantillas
app.set("view engine", "ejs");

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//9. estableciendo las rutas
app.use("/", require("./routes"));

///////////////////////SOCKETS//////////////////////
let ides = new Map();
let mensajes = [];
// connection.query("SELECT * FROM mensajes ", async (error, results) => {
//   console.log(results);
//   for (x of results) {
//     mensajes.push({
//       dniE: x.emisor_dni,
//       msje: x.mensaje,
//       dniR: x.receptor_dni,
//     });
//   }
//   const SocketIO = require("socket.io");
//   const io = SocketIO(server);
//   io.on("connection", (socket) => {
//     socket.on("conectar", (data) => {
//       let mensajesDelchat = [];
//       for (mensaje of mensajes) {
//         if (mensaje.dniE == data.dni || mensaje.dniR == data.dni) {
//           mensajesDelchat.push(mensaje);
//         }
//       }
//       ides.set(data.dni, socket.id);
//       console.log(data.dni, socket.id);
//       io.to(socket.id).emit("inicio", mensajesDelchat);
//     });
//     socket.on("mensaje", (data) => {
//       mensajes.push({
//         dniE: data.dniE + "",
//         msje: data.mensaje,
//         dniR: data.dniR + "",
//       });
//       console.log(
//         { dniE: data.dniE + "", msje: data.mensaje, dniR: data.dniR + "" },
//         ides.get(data.dniR + "")
//       );
//       io.to(ides.get(data.dniR)).emit("mensaje", {
//         dniE: data.dniE + "",
//         msje: data.mensaje,
//         dniR: data.dniR + "",
//       });
//       connection.query(
//         'INSERT INTO mensajes( mensaje,  emisor_dni, receptor_dni) VALUES ("' +
//           (data.mensaje + "") +
//           '", "' +
//           (data.dniE + "") +
//           '","' +
//           (data.dniR + "") +
//           '"); ',
//         async (error, results) => {}
//       );
//     });
//   });
// });
