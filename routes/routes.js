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
    respuesta.render('../views/paciente/index.ejs');
});

router.get('/paciente/doctor',(peticion,respuesta)=>{
    respuesta.render('../views/paciente/sites/info.ejs');
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