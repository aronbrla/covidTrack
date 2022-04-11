const express = require("express");
const router = express.Router();
const connection = require("../database/db");  // Conexion de la BD

const expressLayouts = require('express-ejs-layouts')   // libreria para usar plantillas con EJS
router.use(expressLayouts)
router.use((req, res, next) => {                        // cambiando layout para mi ruta paciente
  req.app.set('layout', './layouts/layoutDoc');         // Directorio de plantillas
  next();
});

const { getUserByMail, getPacByDocDNI, getFormsByDocDNI, getCitasDetailsByDocDNI,
  updateDocByDNI, getDocByDNI, updateDocPassByMail,
  createCita, deleteCita } = require('../database/queries')

//Rutas del dash DOCTOR
router.get("/", (req, res) => {
  let citasList = [
    { date: "2021/09/04T15:00:00" },
    { date: "2021/09/05T18:00:00" },
    { date: "2021/09/06T15:00:00" },
  ];
  res.render("doctor/index", {
    title: 'Home',
    npacientes: req.session.NUMEROPACIENTES,
    ncitas: req.session.NUMEROCITAS,
  });
});

router.get("/informacion", (req, res) => {
  res.render("doctor/info", {
    title: 'Información',
    nombred: req.session.NOMBREDOCTOR,
    correod: req.session.CORREODOCTOR,
    telefonod: req.session.TELEFONODOCTOR,
    dnid: req.session.DNIDOCTOR,
  });
});

router.get("/pacientes", (req, res) => {
  connection.query(getPacByDocDNI, [req.session.DNIDOCTOR], async (err, results) => {
    if (err) {
      console.log("ERROR: " + err);
    } else {
      connection.query(getFormsByDocDNI, [req.session.DNIDOCTOR], async (err, results1) => {
        if (err) {
          console.log("ERROR: " + err);
        } else {
          console.log("pruf");
          console.log(results);
          console.log(results1);
          res.render("doctor/pacientes", {
            title: 'Pacientes',
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

router.get("/citas", (req, res) => {
  let citasList = []
  let pacienteList = []
  citasList = [{}]
  const citasSQL = getCitasDetailsByDocDNI
  connection.query(citasSQL, [req.session.DNIDOCTOR], async (error, results) => {
    // console.log(results)
    results.map(cita => {
      citasList.push({
        pacDNI: cita.pac_dni,
        todo: `${cita.pac_apellidos} ${cita.pac_nombres}`,
        date: cita.fecha,
      });
    })
    connection.query(getPacByDocDNI, [req.session.DNIDOCTOR], async (error, results) => {
      for (let i = 0; i < results.length; i++) {
        pacienteList.push({
          dni: results[i].pac_dni,
          nombre: results[i].pac_apellidos + " " + results[i].pac_nombres,
        });
      }
      res.render("doctor/citas", {
        title: 'Citas',
        dnid: req.session.DNIDOCTOR,
        pacientes: JSON.stringify(pacienteList),
        doc: req.session.NOMBREDOCTOR,
        citasList: JSON.stringify(citasList),
      });
    }
    );
  }
  );
});

router.get("/chat", (req, res) => {
  connection.query(getPacByDocDNI, [req.session.DNIDOCTOR], async (error, results) => {
    res.render("doctor/chat", {
      title: 'Chat',
      dnioculto: req.session.DNIDOCTOR,
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
      title: 'Ajustes',
      nombred: req.session.NOMBREDOCTOR,
      dnid: req.session.DNIDOCTOR,
      telefonod: req.session.TELEFONODOCTOR,
      correod: req.session.CORREODOCTOR,
      sexod: req.session.SEXODOC,
    });
  } else {
    res.redirect('/login')
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
  connection.query(updateDocByDNI, [email, celular, req.session.DNIDOCTOR], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      connection.query(getDocByDNI, [req.session.DNIDOCTOR],
        async (error, results) => {
          if (error) {
            console.log(error);
          } else {
            req.session.loggedin = true;
            req.session.NOMBREDOCTOR = results[0].doc_nombres + " " + results[0].doc_apellidos;
            req.session.CORREODOCTOR = results[0].doc_email;
            req.session.DNIDOCTOR = results[0].doc_dni;
            req.session.TELEFONODOCTOR = results[0].doc_celular;
            req.session.SEXODOC = results[0].doc_sexo;

            res.redirect('/doctor/ajustes')
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
    connection.query(getUserByMail, ["doctor", req.session.CORREODOCTOR],
      async (error, results) => {
        if (pass != results[0][0].doc_contrasenia) {
          res.send("La contraseña actual es incorrecta.");
        } else {
          if (npass == pass) {
            res.send("La constraseña actual y la nueva no pueden ser iguales.");
          } else {
            if (npass == cpass) {
              connection.query(updateDocPassByMail, [npass, req.session.CORREODOCTOR],
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
  // console.log(evento);
  connection.query(createCita,
    {
      pac_dni: req.body.pacientedni,
      estado: "No realizado",
      doc_dni: req.body.dnid,
      fecha: req.body.date,
    },
    async (error, results) => {
      if (error) {
        console.error(error);
      } else {
        res.redirect("/doctor/citas");
      }
    }
  );
});

router.post("/deleteCita", async (req, res) => {
  const { pacienteDni, dateTime } = req.body
  const delCitaSQL = deleteCita
  // console.log(evento);
  connection.query(delCitaSQL, [pacienteDni, dateTime], async (error, results) => {
    if (error) {
      console.error(error);
    } else {
      res.redirect("/doctor/citas");
    }
  }
  );
});


module.exports = router;
