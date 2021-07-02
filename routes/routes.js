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

module.exports = router;