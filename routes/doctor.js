const express = require("express");
const router = express.Router();
const connection = require("../database/db");  // Conexion de la BD

const expressLayouts = require('express-ejs-layouts')   // libreria para usar plantillas con EJS
router.use(expressLayouts)
router.use((req, res, next) => {                        // cambiando layout para mi ruta paciente
  req.app.set('layout', './layouts/layoutDoc');         // Directorio de plantillas
  next();
});

//Rutas del dash DOCTOR
router.get("/", (peticion, respuesta) => {
  respuesta.render("doctor/index", {
    npacientes: peticion.session.NUMEROPACIENTES,
    ncitas: peticion.session.NUMEROCITAS,
  });
});

router.get("/informacion", (peticion, respuesta) => {
  respuesta.render("doctor/info", {
    nombred: peticion.session.NOMBREDOCTOR,
    correod: peticion.session.CORREODOCTOR,
    telefonod: peticion.session.TELEFONODOCTOR,
    dnid: peticion.session.DNIDOCTOR,
  });
});

router.get("/pacientes", (peticion, respuesta) => {
  connection.query(
    "SELECT pac_apellidos, pac_nombres, pac_dni, pac_celular FROM paciente WHERE doc_dni =?",
    [peticion.session.DNIDOCTOR],
    async (err, results) => {
      if (err) {
        console.log("ERROR: " + err);
      } else {
        connection.query(
          "select * from formulario WHERE doc_dni =?",
          [peticion.session.DNIDOCTOR],
          async (err1, results1) => {
            if (err) {
              console.log("ERROR: " + err);
            } else {
              console.log("pruf");
              console.log(results);
              console.log(results1);
              respuesta.render("doctor/pacientes", {
                listapacientes: JSON.stringify(results),
                listaFormularios: JSON.stringify(results1),
              });
            }
          }
        );
      }
    }
  );
});

router.get("/citas", (peticion, respuesta) => {
  let citasList = [];
  let pacienteList = [];
  citasList = [{}];
  connection.query(
    "SELECT pac_nombres, pac_apellidos, citas.fecha, citas.estado, citas.pac_dni FROM paciente INNER JOIN citas WHERE citas.doc_dni=?",
    [peticion.session.DNIDOCTOR],
    async (error, results) => {
      for (let i = 0; i < results.length; i++) {
        citasList.push({
          pacDNI: results[i].pac_dni,
          todo: results[i].pac_apellidos + " " + results[i].pac_nombres,
          date: results[i].fecha,
        });
      }
      connection.query(
        "SELECT * FROM paciente WHERE doc_dni=?",
        [peticion.session.DNIDOCTOR],
        async (error, results) => {
          for (let i = 0; i < results.length; i++) {
            pacienteList.push({
              dni: results[i].pac_dni,
              nombre: results[i].pac_apellidos + " " + results[i].pac_nombres,
            });
          }
          respuesta.render("doctor/citas", {
            dnid: peticion.session.DNIDOCTOR,
            pacientes: JSON.stringify(pacienteList),
            doc: peticion.session.NOMBREDOCTOR,
            citasList: JSON.stringify(citasList),
          });
        }
      );
    }
  );
});

router.get("/chat", (peticion, respuesta) => {
  connection.query(
    "SELECT pac_apellidos, pac_nombres, pac_dni, pac_celular FROM paciente WHERE doc_dni =?",
    [peticion.session.DNIDOCTOR],
    async (error, results) => {
      respuesta.render("doctor/chat", {
        dnioculto: peticion.session.DNIDOCTOR,
        listapacientes: JSON.stringify(results),
      });
    }
  );
});

//12 auth page
router.get("/ajustes", (req, res) => {
  if (req.session.loggedin) {
    res.render("doctor/ajustes", {
      login: true,
      nombred: req.session.NOMBREDOCTOR,
      dnid: req.session.DNIDOCTOR,
      telefonod: req.session.TELEFONODOCTOR,
      correod: req.session.CORREODOCTOR,
      sexod: req.session.SEXODOC,
    });
  } else {
    res.render("login", {
      login: false,
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login"); // siempre se ejecutará después de que se destruya la sesión
      console.log("cerraste sesion 2");
    }
  });
});

//15. Editar datos doctor
router.post("/editar", async (req, res) => {
  // const distrito=req.body.distrito;

  const celular = req.body.phone;
  const email = req.body.email;
  connection.query(
    "UPDATE doctores SET doc_email=?, doc_celular=? WHERE doc_dni=?",
    [email, celular, req.session.DNIDOCTOR],
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        connection.query(
          "SELECT * FROM doctores WHERE doc_dni = ?",
          [req.session.DNIDOCTOR],
          async (error, results) => {
            if (error) {
              console.log(error);
            } else {
              req.session.loggedin = true;
              req.session.NOMBREDOCTOR =
                results[0].doc_nombres + " " + results[0].doc_apellidos;
              req.session.CORREODOCTOR = results[0].doc_email;
              req.session.DNIDOCTOR = results[0].doc_dni;
              req.session.TELEFONODOCTOR = results[0].doc_celular;
              req.session.SEXODOC = results[0].doc_sexo;
              // let region= "ancash";
              // let edad = "18";
              // let sexo="Masculino";
              // let distrito ="Chimbote";
              // let doctor = "Dr. House";
              // let telefonoDoctor = "0000000";
              // let correoDoctor="drhouse@hotmail.com";
              // let dniDoctor="333333";
              // let ultimaCita="ayer";
              // let proximaCita="hoy";

              res.render("doctor", {
                npacientes: req.session.NUMEROPACIENTES,
              });
            }
          }
        );
      }
    }
  );
});

router.post("/EditCon", async (req, res) => {
  const pass = req.body.pass;
  const npass = req.body.passwordNew1;
  const cpass = req.body.passwordNew2;
  if (pass && npass && cpass) {
    connection.query(
      "SELECT * FROM doctores WHERE doc_email = ?",
      [req.session.CORREODOCTOR],
      async (error, results) => {
        if (pass != results[0].doc_contrasenia) {
          res.send("La contraseña actual es incorrecta.");
        } else {
          if (npass == pass) {
            res.send("La constraseña actual y la nueva no pueden ser iguales.");
          } else {
            if (npass == cpass) {
              connection.query(
                "UPDATE doctores SET doc_contrasenia=? WHERE doc_email=?",
                [npass, req.session.CORREODOCTOR],
                async (error, results) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(
                      "¡Contraseña cambiada! Por favor vuelve a loguearte."
                    );
                    req.session.destroy(() => {
                      console.log("cerraste sesion");
                      res.redirect("/login");
                    });
                  }
                }
              );
            } else {
              console.log("Las contraseñas no son iguales.");
            }
          }
        }
      }
    );
  }
});

//Agregar cita Doctor
router.post("/addCita", async (req, res) => {
  let evento = req.body;
  console.log(evento);
  connection.query(
    "INSERT INTO citas SET?",
    {
      pac_dni: req.body.pacientedni,
      estado: "No realizado",
      doc_dni: req.body.dnid,
      fecha: req.body.date,
    },
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/doctor/citas");
      }
    }
  );
});

router.post("/deleteCita", async (req, res) => {
  let evento = req.body;
  console.log(evento);
  connection.query(
    "DELETE FROM citas WHERE pac_dni=? AND fecha=?",
    [req.body.pacienteDni, req.body.dateTime],
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/doctor/citas");
      }
    }
  );
});


module.exports = router;
