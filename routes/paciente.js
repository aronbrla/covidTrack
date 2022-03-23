const router = require("express").Router()
const connection = require("../database/db")  // Conexion de la BD
const bcryptjs = require("bcryptjs")          // invocamos a bcryptjs

const expressLayouts = require('express-ejs-layouts')   // libreria para usar plantillas con EJS
router.use(expressLayouts)
router.use((req, res, next) => {                  // cambiando layout para mi ruta paciente
  req.app.set('layout', './layouts/layoutPac');   // Directorio de plantillas
  next();
});

//Rutas del dash Paciente
router.get("/", (req, res) => {
  let citasList = [
    { date: "2021/09/04T15:00:00" },
    { date: "2021/09/05T18:00:00" },
    { date: "2021/09/06T15:00:00" },
  ];
  res.render("paciente/index", {
    login: true,
    NOMBRE: req.session.NOMBRe,
    NDOC: req.session.NOMDOC,
    NCOR: req.session.CORDOC,
    COLDOC: req.session.COLDOC,
    SEXODOC: req.session.SEXODOC,
    citasList: JSON.stringify(citasList),
  });
});

router.get("/informacion", (req, res) => {
  if (req.session.loggedin) {
    res.render("paciente/info", {
      login: true,
      NOMBRE: req.session.NOMBRe,
      DNI: req.session.DNi,
      DIRECCION: req.session.DIRECCIOn,
      TELEFONO: req.session.TELEFONo,
      CORREO: req.session.CORREo,
      EDAD: req.session.EDAd,
      SEXO: req.session.SEXo,
      DISTRITO: req.session.DISTRITo,
      REGION: "region",
    });
  } else {
    res.redirect('/logout')
  }
});

router.get("/citas", (req, res) => {
  let citasList = [];
  connection.query("SELECT * FROM citas", async (error, results) => {
    for (let i = 0; i < results.length; i++) {
      citasList.push({ todo: "Cita médica", date: results[i].fecha });
    }
    res.render("paciente/citas", {
      login: true,
      NOMBRE: req.session.NOMBRe,
      citasList: JSON.stringify(citasList),
      doc: req.session.NOMDOC,
    });
  });
});

//12 auth page
router.get("/ajustes", (req, res) => {
  if (req.session.loggedin) {
    res.render("paciente/ajustes", {
      login: true,
      NOMBRE: req.session.NOMBRe,
      DNI: req.session.DNi,
      DIRECCION: req.session.DIRECCIOn,
      TELEFONO: req.session.TELEFONo,
      CORREO: req.session.CORREo,
      EDAD: req.session.EDAd,
      SEXO: req.session.SEXo,
      DISTRITO: req.session.DISTRITo,
      REGION: "region",
    });
  } else {
    res.render("login", {
      login: false,
    });
  }
});

router.get("/formulario", (req, respuesta) => {
  respuesta.render("paciente/formulario", {
    login: true,
    NOMBRE: req.session.NOMBRe,
  });
});

router.get("/chat", (peticion, respuesta) => {
  connection.query(
    "SELECT doc_apellidos, doc_nombres, doc_dni FROM doctores WHERE doc_dni =?",
    [peticion.session.DNIDOCTOR1],
    async (error, results) => {
      respuesta.render("paciente/chat", {
        dnioculto: peticion.session.DNi,
        listadoctor: JSON.stringify(results),
        NOMBRE: peticion.session.NOMBRe,
      });
    }
  );
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

//14. Editar datos paciente
router.post("/editar", async (req, res) => {
  // const distrito=req.body.distrito;
  const celular = req.body.phone;
  const domicilio = req.body.address;
  const distrito = req.body.distrito;
  connection.query(
    "UPDATE paciente SET pac_distrito=?, pac_direccion=? , pac_celular=? WHERE pac_dni=?",
    [distrito, domicilio, celular, req.session.DNi],
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        connection.query(
          "SELECT * FROM paciente WHERE pac_email = ?",
          [req.session.CORREo],
          async (error, results) => {
            if (error) {
              console.log(error);
            } else {
              req.session.loggedin = true;
              req.session.NOMBRe =
                results[0].pac_nombres + " " + results[0].pac_apellidos;
              req.session.CORREo = results[0].pac_email;
              req.session.DIRECCIOn = results[0].pac_direccion;
              req.session.DNi = results[0].pac_dni;
              req.session.TELEFONo = results[0].pac_celular;
              let fecha = results[0].pac_nacimiento;
              let a = fecha.toString();
              let b = a.substring(4, 15);
              req.session.DISTRITo = results[0].pac_distrito;
              req.session.EDAd = b;
              req.session.SEXo = results[0].pac_sexo;
              console.log(req.session.NOMBRe);

              res.render("paciente", {
                login: true,
                NOMBRE: req.session.NOMBRe,
                NDOC: req.session.NOMDOC,
                NCOR: req.session.CORDOC,
                CELDOC: req.session.CELULDOC,
                SEXODOC: req.session.SEXo,
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
  let passwordHaash = await bcryptjs.hash(pass, 8);
  let passwordHaas = await bcryptjs.hash(npass, 8);
  console.log(pass);
  console.log(npass);
  console.log(cpass);
  if (pass && npass && cpass) {
    connection.query(
      "SELECT * FROM paciente WHERE pac_email = ?",
      [req.session.CORREo],
      async (error, results) => {
        if (!(await bcryptjs.compare(pass, results[0].pac_contrasenia))) {
          res.send("La contraseña actual es incorrecta.");
        } else {
          if (npass == pass) {
            res.send("La constraseña actual y la nueva no pueden ser iguales.");
          } else {
            if (npass == cpass) {
              connection.query(
                "UPDATE paciente SET pac_contrasenia=? WHERE pac_email=?",
                [passwordHaas, req.session.CORREo],
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

//guardar formulario paciente
router.post("/guardarformulario", async (req, res) => {
  console.log(req.body);
  var formatedMysqlString = new Date(
    new Date(new Date(new Date()).toISOString()).getTime() -
      new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  console.log(formatedMysqlString);
  var fechas = new Date();
  let sintom = JSON.stringify(req.body.sintoma);
  let enferme = JSON.stringify(req.body.enfermedad);

  console.log(sintom);
  console.log(enferme);

  connection.query(
    "INSERT INTO formulario SET ?",
    {
      pac_dni: req.session.DNi,
      doc_dni: req.session.DNIDOCTOR1,
      temperatura: req.body.temp,
      saturacion: req.body.oxig,
      sintomas: sintom,
      enfermedades: enferme,
      fecha: fechas,
    },
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.render("paciente", {
          login: true,
          NOMBRE: req.session.NOMBRe,
          NDOC: req.session.NOMDOC,
          NCOR: req.session.CORDOC,
          COLDOC: req.session.COLDOC,
          SEXODOC: req.session.SEXo,
        });
      }
    }
  );
});

module.exports = router;
