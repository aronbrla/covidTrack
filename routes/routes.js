const express = require('express');
const router = express.Router();

router.get('/',(peticion,respuesta)=>{
    respuesta.render('index',{msg:'ESTE ES UN MENSAJE DESDE NODE'});
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

router.get('/paciente/dash',(peticion,respuesta)=>{
    respuesta.render('../views/paciente/index.ejs');
});

module.exports = router;