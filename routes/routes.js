const express = require('express');
const connection = require('../database/db');
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
router.get('/paciente',(req,respuesta)=>{
  
    respuesta.render('../views/paciente/index.ejs',{
        login:true,
        NOMBRE: req.session.NOMBRe,
        NDOC: req.session.NOMDOC,
        NCOR: req.session.CORDOC,
        COLDOC: req.session.COLDOC,
        SEXODOC: req.session.SEXODOC
        
    });

});

router.get('/paciente/informacion',(req,res)=>{
    if(req.session.loggedin){
        res.render('../views/paciente/sites/info.ejs',{
            login:true,
            NOMBRE: req.session.NOMBRe,
            DNI: req.session.DNi,
            DIRECCION: req.session.DIRECCIOn,
            TELEFONO: req.session.TELEFONo,
            CORREO: req.session.CORREo,
            EDAD: req.session.EDAd,
            SEXO: req.session.SEXo,
            DISTRITO: req.session.DISTRITo,
            REGION: 'region'
            
        });

    }else{
        res.render('/views/login.ejs',{
            login: false
        });
    }
                            
});

router.get('/paciente/citas',(req,respuesta)=>{
    let citasList = [
        {
            
            todo: 'Cita médica',
            date: '2021-08-27T19:00:00',
        },
        {
            
            todo: 'Cita médica',
            date: '2021-08-22T19:00:00',
        },
        {
            //si quieres añades el nombre del doctor xd
        //  doctor: '',
            todo: 'Cita médica',
            date: '2021-08-21T19:00:00',
        }
    ];
    connection.query('SELECT * FROM citas',async(error,results)=>{
        for(let i=0;i<results.length;i++){
            citasList.push({todo:"Cita médica",date: results[i].fecha});
            //citasList.push({todo:"Cita médica",date: results[i].fecha,doctor:req.session.NOMDOC});
        }
        respuesta.render('../views/paciente/sites/citas.ejs',{
            login:true,
            NOMBRE: req.session.NOMBRe,
            citasList:JSON.stringify(citasList),
        });
    })

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
            SEXO: req.session.SEXo,
            DISTRITO: req.session.DISTRITo,
            REGION: 'region'
        });

    }else{
        res.render('/views/login.ejs',{
            login: false
        });
    }
});

router.get('/paciente/formulario',(req,respuesta)=>{

    respuesta.render('../views/paciente/sites/formulario.ejs',{
        login:true,
        NOMBRE: req.session.NOMBRe,
    });
});

router.get('/paciente/chat',(peticion,respuesta)=>{
    connection.query('SELECT doc_apellidos, doc_nombres, doc_dni FROM doctores WHERE doc_dni =?',[peticion.session.DNIDOCTOR1],async(error,results)=>{
        respuesta.render('../views/paciente/sites/chat.ejs', { dnioculto: peticion.session.DNi, listadoctor: JSON.stringify(results), NOMBRE: peticion.session.NOMBRe });
    })
})
router.get('/paciente/logout',(req,res)=>{
    req.session.destroy((err) => {
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/login'); // siempre se ejecutará después de que se destruya la sesión
            console.log("cerraste sesion 2");
        }
	});
})
//Fin de las rutas del dash paciente


//Rutas del dash DOCTOR
router.get('/doctor',(peticion,respuesta)=>{
            respuesta.render('../views/doctor/index.ejs',{
                npacientes:peticion.session.NUMEROPACIENTES
            });
})

router.get('/doctor/informacion',(peticion,respuesta)=>{                            
    respuesta.render('../views/doctor/sites/info.ejs',{
        nombred:peticion.session.NOMBREDOCTOR,
        correod:peticion.session.CORREODOCTOR,
        telefonod:peticion.session.TELEFONODOCTOR,
        dnid: peticion.session.DNIDOCTOR
    });
});

router.get('/doctor/pacientes',(peticion,respuesta)=>{
   
    connection.query(
        'SELECT pac_apellidos, pac_nombres, pac_dni, pac_celular FROM paciente WHERE doc_dni =?',
        [peticion.session.DNIDOCTOR],
        async(err, results) => {
            if (err) {
                console.log("ERROR: " + err);
            }
            else {
                respuesta.render('../views/doctor/sites/pacientes.ejs', { listapacientes: JSON.stringify(results) });
            }
        }
    )
                   
  
});

router.get('/doctor/citas',(peticion,respuesta)=>{
    let citasList = [
        {
            pacDNI: '16485',
            todo: '',
            date: '2021-08-27T19:00:00',
        },
        {
            pacDNI: '16485',
            todo: '',
            date: '2021-08-21',
        },
        {
            pacDNI: '16485',
            todo: '',
            date: '2021-08-21',
        },
        {
            pacDNI: '16485',
            todo: '',
            date: '2021-08-21',
        },
        {
            pacDNI: '16485',
            todo: '',
            date: '2021-08-21',
        }
    ];
    let pacienteList = [
        {
            dni:'684631',
            nombre: 'Manuel',
        },
        {
            dni:'684631',
            nombre: 'Manuel',
        },
        {
            dni:'684631',
            nombre: 'Manuel',
        },
    ]
    console.log(peticion.session.NOMBREDOCTOR);
    connection.query('SELECT pac_nombres, pac_apellidos, citas.fecha, citas.estado, citas.pac_dni FROM paciente INNER JOIN citas WHERE citas.doc_dni=?',[peticion.session.DNIDOCTOR],async(error,results)=>{
          for(let i=0;i<results.length;i++){
            citasList.push({pacDNI:results[i].pac_dni,todo:results[i].pac_apellidos +" "+ results[i].pac_nombres,date: results[i].fecha});
          }
          connection.query('SELECT * FROM paciente WHERE doc_dni=?',[peticion.session.DNIDOCTOR],async(error,results)=>{
              for(let i=0;i<results.length;i++){
                pacienteList.push({dni:results[i].pac_dni,nombre:results[i].pac_apellidos +" "+ results[i].pac_nombres});
              }
              respuesta.render('../views/doctor/sites/citas.ejs',{
                dnid: peticion.session.DNIDOCTOR,
                pacientes:JSON.stringify(pacienteList),
                citasList:JSON.stringify(citasList)}); 
          })  
        
    })

});

router.get('/doctor/chat',(peticion,respuesta)=>{
    connection.query('SELECT pac_apellidos, pac_nombres, pac_dni, pac_celular FROM paciente WHERE doc_dni =?',[peticion.session.DNIDOCTOR],async(error,results)=>{
        
        
        respuesta.render('../views/doctor/sites/chat.ejs',{dnioculto:peticion.session.DNIDOCTOR,listapacientes:JSON.stringify(results)});
       
        
    })
        
    
});

  //12 auth page
router.get('/doctor/ajustes',(req,res)=>{
    if(req.session.loggedin){
        res.render('../views/doctor/sites/ajustes.ejs',{
            login:true,
            nombred: req.session.NOMBREDOCTOR,
            dnid: req.session.DNIDOCTOR,
            telefonod: req.session.TELEFONODOCTOR,
            correod: req.session.CORREODOCTOR,
            sexod: req.session.SEXODOC,
        });
    }else{
        res.render('/views/login.ejs',{
            login: false
        });
    }
});

router.get('/doctor/logout',(req,res)=>{
    req.session.destroy((err) => {
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/login'); // siempre se ejecutará después de que se destruya la sesión
            console.log("cerraste sesion 2");
        }
	});
})





module.exports = router;