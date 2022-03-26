const router = require("express").Router();
const connection = require("../database/db"); // Conexion de la BD
const bcryptjs = require("bcryptjs"); // invocamos a bcryptjs

const expressLayouts = require("express-ejs-layouts"); // libreria para usar plantillas con EJS
router.use(expressLayouts);
router.use((req, res, next) => {
  // cambiando layout para mi ruta paciente
  req.app.set("layout", "./layouts/layoutPac"); // Directorio de plantillas
  next();
});

const { getCitasByPacDNI, getDocByDNI, updatePacByDNI, 
        updatePacPassByMail, savePacForm } = require("../database/queries");

//Rutas del dash Paciente
router.get("/", (req, res) => {
  let citasList = [
    { date: "2021/09/04T15:00:00" },
    { date: "2021/09/05T18:00:00" },
    { date: "2021/09/06T15:00:00" },
  ];
  res.render("paciente/index", {
    login: true,
    title: "Home",
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
      title: "Informacion",
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
    res.redirect("/logout");
  }
});

router.get("/citas", (req, res) => {
  let citasList = [];
  connection.query(getCitasByPacDNI, [req.session.DNi], async (error, results) => {
    results.map((cita) => {
      citasList.push({ todo: "Cita médica", date: cita.fecha });
    });
    res.render("paciente/citas", {
      login: true,
      title: "Citas",
      NOMBRE: req.session.NOMBRe,
      citasList: JSON.stringify(citasList),
      doc: req.session.NOMDOC,
    });
  }
  );
});

//12 auth page
router.get("/ajustes", (req, res) => {
  if (req.session.loggedin) {
    res.render("paciente/ajustes", {
      login: true,
      title: "Ajustes",
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
    res.redirect("/login");
  }
});

router.get("/formulario", (req, res) => {
  res.render("paciente/formulario", {
    login: true,
    title: "Formulario",
    NOMBRE: req.session.NOMBRe,
  });
});

router.get("/chat", (req, res) => {
  connection.query(getDocByDNI, [req.session.DNIDOCTOR1], async (error, results) => {
    res.render("paciente/chat", {
      title: "Chat",
      dnioculto: req.session.DNi,
      listadoctor: JSON.stringify(results),
      NOMBRE: req.session.NOMBRe,
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
  connection.query(updatePacByDNI, [distrito, domicilio, celular, req.session.DNi], async (error, results) => {
    if (error) {
      return console.error(error);
    } else {
      connection.query(getUserByMail, ["paciente", req.session.CORREo], async (error, results) => {
        if (error) {
          console.error(error);
        } else {
          user = { ...results[0][0] }
          req.session.loggedin = true;
          req.session.NOMBRe = `${user.pac_nombres} ${user.pac_apellidos}`
          req.session.CORREo = user.pac_email;
          req.session.DIRECCIOn = user.pac_direccion;
          req.session.DNi = user.pac_dni;
          req.session.TELEFONo = user.pac_celular;
          let fecha = user.pac_nacimiento;
          let a = fecha.toString();
          let b = a.substring(4, 15);
          req.session.DISTRITo = user.pac_distrito;
          req.session.EDAd = b;
          req.session.SEXo = user.pac_sexo;
          // console.log(req.session.NOMBRe);

          res.redirect("/paciente/ajustes");
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
  let passwordHaas = await bcryptjs.hash(npass, 8);
  // console.log(pass);
  // console.log(npass);
  // console.log(cpass);
  if (pass && npass && cpass) {
    connection.query(getUserByMail, ["paciente", req.session.CORREo], async (error, results) => {
      if (!(await bcryptjs.compare(pass, results[0][0].pac_contrasenia))) {
        res.send("La contraseña actual es incorrecta.");
      } else {
        if (npass == pass) {
          res.send("La constraseña actual y la nueva no pueden ser iguales.");
        } else {
          if (npass == cpass) {
            connection.query(updatePacPassByMail, [passwordHaas, req.session.CORREo], async (error, results) => {
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
  // console.log(req.body);
  var formatedMysqlString = new Date(
    new Date(new Date(new Date()).toISOString()).getTime() -
    new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  // console.log(formatedMysqlString);
  var fechas = new Date();
  let sintom = JSON.stringify(req.body.sintoma);
  let enferme = JSON.stringify(req.body.enfermedad);

  // console.log(sintom);
  // console.log(enferme);

  connection.query(savePacForm,
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
        console.error(error);
      } else {
        res.redirect("/paciente");
      }
    }
  );
});

module.exports = router;
