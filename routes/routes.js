const express = require('express');
const router = express.Router();

/*router.get('/',(peticion,respuesta)=>{
    respuesta.render('index');
});*/
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
    
                            
    respuesta.render('../views/paciente/sites/info.ejs');
});

router.get('/paciente/citas',(peticion,respuesta)=>{
    respuesta.render('../views/paciente/sites/citas.ejs');
});
  //12 auth page
router.get('/paciente/ajustes',(req,res)=>{
    if(req.session.loggedin){
        res.render('../views/paciente/sites/ajustes.ejs',{
            login:true,
            NOMBRE: req.session.NOMBRe,
            DNI: req.session.DNi,
            DIRECCION: req.session.DIRECCIOn,
            TELEFONO: req.session.TELEFONo,
            CORREO: req.session.CORREo,
            EDAD: req.session.EDAd,
            SEXO: 'F o M',
            DISTRITO: 'un distrito',
            REGION: 'region'
        });
    }else{
        res.render('/views/login.ejs',{
            login: false
        });
    }
});

router.get('/paciente/formulario',(peticion,respuesta)=>{
    
    respuesta.render('../views/paciente/sites/formulario.ejs');
});
//Fin de las rutas del dash paciente

module.exports = router;