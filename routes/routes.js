const express = require('express');
const router = express.Router();

router.get('/',(peticion,respuesta)=>{
    respuesta.render('index');
});
router.get('/login',(peticion,respuesta)=>{
    respuesta.render('login');
});
router.get('/register',(peticion,respuesta)=>{
    respuesta.render('register');
});
router.get('/forget',(peticion,respuesta)=>{
    respuesta.render('forget');
});

router.get('/dash',(peticion,respuesta)=>{
    respuesta.render('dash');
});

//Rutas del dash Paciente
router.get('/paciente',(peticion,respuesta)=>{
    respuesta.render('../views/paciente/index.ejs');
});

router.get('/paciente/informacion',(peticion,respuesta)=>{
    let mail="uno@mail.com";
                            let name= "Aaron Blas";
                            let pdni="05151846";
                            let adress="Jr la Verga 123";
                            let phone="03515531";
                            console.log(name);

                            let region= "ancash";
                            let edad = "18";
                            let sexo="Masculino";
                            let distrito ="Chimbote";
                            let doctor = "Dr. House";
                            let telefonoDoctor = "0000000";
                            let correoDoctor="drhouse@hotmail.com";
                            let dniDoctor="333333";
                            let ultimaCita="ayer";
                            let proximaCita="hoy";
    respuesta.render('../views/paciente/sites/info.ejs',{NOMBRE:name,EDAD:edad,DNI:pdni, REGION:region,SEXO:sexo,DISTRITO:distrito,
        DIRECCION:adress,CORREO:mail,TELEFONO:phone,DR:doctor,TELEDR:telefonoDoctor,
        CORREODR:correoDoctor,DNIDR:dniDoctor,LAST:ultimaCita,NEXT:proximaCita
        });
});

router.get('/paciente/citas',(peticion,respuesta)=>{
    respuesta.render('../views/paciente/sites/citas.ejs');
});

router.get('/paciente/ajustes',(peticion,respuesta)=>{
    respuesta.render('../views/paciente/sites/ajustes.ejs');
});

router.get('/paciente/formulario',(peticion,respuesta)=>{
    respuesta.render('../views/paciente/sites/formulario.ejs');
});
//Fin de las rutas del dash paciente

module.exports = router;