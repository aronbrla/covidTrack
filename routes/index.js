const express = require("express");
const connection = require("../database/db");
const router = express.Router();
const bcryptjs = require("bcryptjs");         // invocamos a bcryptjs

const pacienteRouter = require("./paciente");
const doctorRouter = require("./doctor");

const { getUserByMail, getDocByDNI, getPacsDNI, getCitasByDocDNI, getPacByDNI, createPac } = require('../database/queries')

router.get("/", (peticion, respuesta) => {
  respuesta.render("index");
});
router.get("/login", (peticion, respuesta) => {
  respuesta.render("login");
});
router.get("/register", (peticion, respuesta) => {
  respuesta.render("register");
});

// Creación de Paciente Ruta
router.post("/register", async (req, res) => {
  //capturando datos
  const { mail, name, lastname,
    pass, dni, address, phone,
    date, distrito, sexo } = req.body
  const phoneString = phone.toString()
  //encriptando la contraseña
  let passwordHaas = await bcryptjs.hash(pass, 8);
  //buscamos correo y dni, si ya están en la base de datos no podrá registrarse:
  // console.log(req.body);
  connection.query(getUserByMail, ["paciente", mail], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      if (results[0].length != 0) {
        res.send("USUARIO YA REGISTRADO");
      } else {
        connection.query(getPacByDNI, [dni], async (error, results) => {
          if (error) {
            console.log(error);
          } else {
            if (results.length != 0) {
              res.send("USUARIO YA REGISTRADO");
            } else {
              //si no encuentra los datos, se puede registrar
              connection.query(createPac,
                {
                  pac_nacimiento: date,
                  pac_dni: dni,
                  pac_apellidos: lastname,
                  pac_nombres: name,
                  pac_email: mail,
                  pac_contrasenia: passwordHaas,
                  pac_celular: phoneString,
                  pac_direccion: address,
                  pac_distrito: distrito,
                  pac_sexo: sexo,
                  doc_dni: "72865690",
                },
                async (error, results) => {
                  if (error) {
                    console.log(error);
                  } else {
                    res.redirect('/login');
                  }
                }
              );
            }
          }
        }
        );
      }
    }
  }
  );
});

//11. autenticacion
router.post("/auth", async (req, res) => {
  const { usertype, usermail, pass } = req.body
  if (!usermail && !pass) {
    return res.send("Porfavor ingresa un usuario y contraseña!")
  }
  if (usertype == "paciente") {
    connection.query(getUserByMail, [usertype, usermail], async (err, results) => {
      if (err) return console.error(err);
      // console.log(results)
      const user = { ...results[0][0] }
      if (results[0].length == 0 || !(await bcryptjs.compare(pass, user.pac_contrasenia))) {
        return res.send("Email o contraseña incorrecta")
      }
      req.session.loggedin = true;
      req.session.NOMBRe = `${user.pac_nombres} ${user.pac_apellidos}`;
      req.session.CORREo = user.pac_email;
      req.session.DIRECCIOn = user.pac_direccion;
      req.session.DNi = user.pac_dni;
      req.session.TELEFONo = user.pac_celular;
      req.session.SEXo = user.pac_sexo;
      req.session.DISTRITo = user.pac_distrito;
      req.session.DNIDOCTOR1 = user.doc_dni;
      let fecha = user.pac_nacimiento;
      let a = fecha.toString();
      let b = a.substring(4, 15);
      let citasList = [{}];
      req.session.EDAd = b;
      // console.log(req.session.NOMBRe);
      connection.query(getDocByDNI, ["72865690"], async (error, results) => {
        if (error) {
          console.error(error);
        } else {
          req.session.NOMDOC = `${results[0].doc_nombres} ${results[0].doc_apellidos}`;
          req.session.CORDOC = results[0].doc_email;
          req.session.COLDOC = results[0].doc_especialidad;
          req.session.SEXODOC = results[0].doc_sexo;

          res.redirect('/paciente')
        }
      }
      );
    }
    );
  } else {
    connection.query(getUserByMail, [usertype, usermail], async (err, results, fields) => {
      if (err) throw err
      // console.log(results)
      const user = { ...results[0][0] }
      if (results.length == 0 || pass != user.doc_contrasenia) {
        return res.send("Email o contraseña incorrecta")
      }
      req.session.loggedin = true;
      req.session.NOMBREDOCTOR = `${user.doc_nombres} ${user.doc_apellidos}`;
      req.session.CORREODOCTOR = user.doc_email;
      req.session.TELEFONODOCTOR = user.doc_celular;
      req.session.DNIDOCTOR = user.doc_dni;

      connection.query(getPacsDNI, async (error, results) => {
        req.session.NUMEROPACIENTES = results.length;

        var hoy = new Date(
          new Date(new Date(new Date()).toISOString()).getTime() -
          new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        connection.query(getCitasByDocDNI, [req.session.DNIDOCTOR], async (error, results) => {
          // console.log(results)
          const today = new Date().toISOString()
          console.log(today)
          for (let i = 0; i < results.length; i++) {
            var bbdd = new Date(
              new Date(
                new Date(new Date(results[i].fecha)).toISOString()
              ).getTime() -
              new Date().getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 19)
              .replace("T", " ");
            // console.log("BBDD: " + bbdd + " HOY: " + hoy);
            if (hoy == bbdd) {
              // console.log("fechas iguales");
              // console.log("BBDD: " + bbdd + " HOY: " + hoy);
            }
          }
          req.session.NUMEROCITAS = results.length;
          res.redirect('/doctor')
        }
        );
      }
      );
    }
    );
  }
});

//12. Logout - Destruye la sesión.
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    console.log('cerraste sesion desde home');
    res.redirect('login') // siempre se ejecutará después de que se destruya la sesión
  })
});


//13. función para limpiar la caché luego del logout
router.use((req, res, next) => {
  if (!req.user)
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

//Paciente Rutas
router.use("/paciente", pacienteRouter);
// Doctor Rutas
router.use("/doctor", doctorRouter);

// Contac Us Js usando nodemailer
router.use("/", require("./contact-us"));

module.exports = router;