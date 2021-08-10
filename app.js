//1.importando libreria
const express = require('express');
const app = express(); 
//montando el servidor en la ruta 3000
const port = process.env.PORT || 3000;
var server=app.listen(port,() => {
    console.log(`SERVER RUNNING IN http://localhost:${port}`);
});


///////////////////////////////////
//2. seteamos urlencoded para capturar datos del formulario
app.use(express.urlencoded({extended: false}));
app.use(express.json())

//4 el directorio public
app.use('/resources',express.static('public'));
app.use('resources',express.static(__dirname +'public'));
console.log(__dirname);// te imprime donde la ubicacion de la app js

//5. estableciendo el motor de plantillas
app.set('view engine', 'ejs');

//6. invocamos a bcryptjs
const bcryptjs=require('bcryptjs');

//7 var de session
const session =require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//8. Invocamos al modulo de la conexion de la BD
const connection =require('./database/db');

//9. estableciendo las rutas
app.use('/',require('./routes/routes'));

//10. Registracion
app.post('/register', async (req,res)=>{
    //capturando datos
    const mail=req.body.mail;
    const name=req.body.name;
    const lastname=req.body.lastname;
    const pass=req.body.pass;
    const dni=req.body.dni;
    const address=req.body.address;
    const phone=req.body.phone;
    const date=req.body.date;
    const distrito=req.body.distrito;
    const sexo=req.body.sexo;
    //encriptando la contraseña
    let passwordHaas=await bcryptjs.hash(pass,8);
    //buscamos correo y dni, si ya están en la base de datos no podrá registrarse:
    console.log(req.body);
    connection.query('SELECT * FROM paciente WHERE pac_email= ? ',[mail],async(error,results)=>{
        if(error){
            console.log(error);
        }else{
            if(results.length!=0){
                res.send("USUARIO YA REGISTRADO"); 
            }else{
                connection.query('SELECT * FROM paciente WHERE pac_dni= ? ',[dni],async(error,results)=>{
                    if(error){
                        console.log(error);
                    }else{
                        if(results.length!=0){
                            res.send("USUARIO YA REGISTRADO"); 
                        }else{
                            //si no encuentra los datos, se puede registrar
                            connection.query('INSERT INTO paciente SET ?',{pac_nacimiento:date,pac_dni:dni,pac_apellidos:lastname,pac_nombres:name,pac_email:mail,pac_contrasenia:passwordHaas,pac_celular:phone,pac_direccion:address,pac_distrito:distrito,pac_sexo:sexo,doc_dni:"72865690"},async(error,results)=>{
                                if(error){
                                    console.log(error);
                                }else{
                                    res.send('REGISTRO EXITOSO');
                                }
                            }) 
                        }
                    }
                })
            }
        }
    })

})
//11. autenticacion

app.post('/auth', async(req,res)=>{
    const user= req.body.user;
    const pass= req.body.pass;
    const tipouser=req.body.usertype;
    let passwordHaash=await bcryptjs.hash(pass,8);
    if(user && pass){
        if(tipouser=="paciente"){
            connection.query('SELECT * FROM paciente WHERE pac_email = ?', [user], async(error,results)=>{
                if(results.length==0 || !(await bcryptjs.compare(pass,results[0].pac_contrasenia))){
                    
                    res.send("Email o contraseña incorrecta");
                    
                }else{
                    
                    connection.query('SELECT * FROM paciente WHERE pac_email = ?', [user], async(error,results)=>{
                        if(error){
                            console.log(error);
                        }else{
                            req.session.loggedin=true;
                            req.session.NOMBRe=results[0].pac_nombres+ " "+ results[0].pac_apellidos;
                            req.session.CORREo=results[0].pac_email;
                            req.session.DIRECCIOn=results[0].pac_direccion;
                            req.session.DNi=results[0].pac_dni;
                            req.session.TELEFONo=results[0].pac_celular;
                            req.session.SEXo=results[0].pac_sexo;
                            req.session.DISTRITo=results[0].pac_distrito;
                            req.session.DNIDOCTOR1=results[0].doc_dni;
                            let fecha=results[0].pac_nacimiento;
                            let a=fecha.toString();
                            let b=a.substring(4,15);
                            req.session.EDAd=b;
                            console.log(req.session.NOMBRe);
                           

                            connection.query('SELECT doc_apellidos, doc_nombres, doc_email,doc_celular,doc_sexo FROM paciente INNER JOIN doctores ON paciente.doc_dni=?',["72865690"],async(error,results)=>{
                                if (error){
                                    console.log(error);
                                }else{
                                    req.session.NOMDOC=results[0].doc_nombres+ " "+ results[0].doc_apellidos;
                                    req.session.CORDOC=results[0].doc_email;
                                    req.session.CELULDOC=results[0].doc_celular;
                                    req.session.SEXODOC=results[0].doc_sexo;
                                    
                                    res.render('paciente',{
                                        login:true,
                                        NOMBRE: req.session.NOMBRe,
                                        NDOC: req.session.NOMDOC,
                                        NCOR: req.session.CORDOC,
                                        CELDOC: req.session.CELULDOC,
                                        SEXODOC: req.session.SEXODOC
                                    });
                                }
                            })
                            
                        }
                    })
                    
                }
            })
        }else{
            connection.query('SELECT * FROM doctores WHERE doc_email= ?', [user], async(error,results)=>{
                
                if(results.length==0  || pass!=results[0].doc_contrasenia){
                    
                    res.send("Email o contraseña incorrecta");
                    
                }else{
                    req.session.loggedin=true;
                    req.session.NOMBREDOCTOR=results[0].doc_nombres+ " "+ results[0].doc_apellidos;
                    req.session.CORREODOCTOR=results[0].doc_email;
                    req.session.TELEFONODOCTOR=results[0].doc_celular;
                    req.session.DNIDOCTOR=results[0].doc_dni;
                    
                    connection.query('SELECT pac_dni FROM paciente', async(error,results)=>{
                        req.session.NUMEROPACIENTES=results.length;
                            res.render('doctor',{
                                npacientes:req.session.NUMEROPACIENTES
                            }); 
                    })
                    
                   
                }  
            })

            
        }
     
    } else{
        res.send('Porfavor ingresa un usuario y contraseña!');
        res.end();
    }
});

//12. Logout
//Destruye la sesión.
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
      console.log('cerraste sesion desde home');
	  res.redirect('login') // siempre se ejecutará después de que se destruya la sesión
	})
});


//13. función para limpiar la caché luego del logout
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

//14. Editar datos paciente
app.post('/paciente/editar',async(req,res)=>{
   // const distrito=req.body.distrito;
    const celular=req.body.phone;
    const domicilio=req.body.address;
    const distrito=req.body.distrito;
        connection.query('UPDATE paciente SET pac_distrito=?, pac_direccion=? , pac_celular=? WHERE pac_dni=?',[distrito,domicilio,celular,req.session.DNi],async(error,results)=>{
            if(error){
                console.log(error);
            }else{
                connection.query('SELECT * FROM paciente WHERE pac_email = ?', [req.session.CORREo], async(error,results)=>{
                    if(error){
                        console.log(error);
                    }else{
                        req.session.loggedin=true;
                        req.session.NOMBRe=results[0].pac_nombres+ " "+ results[0].pac_apellidos;
                        req.session.CORREo=results[0].pac_email;
                        req.session.DIRECCIOn=results[0].pac_direccion;
                        req.session.DNi=results[0].pac_dni;
                        req.session.TELEFONo=results[0].pac_celular;
                        let fecha=results[0].pac_nacimiento;
                        let a=fecha.toString();
                        let b=a.substring(4,15);
                        req.session.DISTRITo=results[0].pac_distrito;
                        req.session.EDAd=b;
                        req.session.SEXo=results[0].pac_sexo;
                        console.log(req.session.NOMBRe);
                        
                        
                        res.render('paciente',{
                            login:true,
                            NOMBRE: req.session.NOMBRe,
                            NDOC: req.session.NOMDOC,
                            NCOR: req.session.CORDOC,
                            CELDOC: req.session.CELULDOC,
                            SEXODOC: req.session.SEXo
                        });
                    }
                })
            }
        });
})

app.post('/paciente/EditCon',async(req,res)=>{
    const pass = req.body.pass;
    const npass = req.body.passwordNew1;
    const cpass = req.body.passwordNew2;
    let passwordHaash=await bcryptjs.hash(pass,8);
    let passwordHaas=await bcryptjs.hash(npass,8);
    console.log(pass);
    console.log(npass);
    console.log(cpass);
    if(pass && npass && cpass){
        connection.query('SELECT * FROM paciente WHERE pac_email = ?', [req.session.CORREo], async(error,results)=>{
            if(!(await bcryptjs.compare(pass,results[0].pac_contrasenia))){

                res.send("La contraseña actual es incorrecta.");
                
            }else{
                if(npass == pass){
                    res.send("La constraseña actual y la nueva no pueden ser iguales.")
                }
                else{
                    if(npass == cpass){
                        connection.query('UPDATE paciente SET pac_contrasenia=? WHERE pac_email=?',[passwordHaas,req.session.CORREo],async(error,results)=>{
                            if(error){
                                console.log(error);
                            }else{
                                console.log('¡Contraseña cambiada! Por favor vuelve a loguearte.');
                                req.session.destroy(() => {
                                    console.log('cerraste sesion');
                                    res.redirect('/login')
                                })
                            }
                        })
                    }
                    else{
                        console.log('Las contraseñas no son iguales.');
                    }
                }
            }

        })
    }
})

//15. Editar datos doctor
app.post('/doctor/editar',async(req,res)=>{
    // const distrito=req.body.distrito;
    
    const celular=req.body.phone;
    const email=req.body.email;
        connection.query('UPDATE doctores SET doc_email=?, doc_celular=? WHERE doc_dni=?',[email,celular,req.session.DNIDOCTOR],async(error,results)=>{
            if(error){
                console.log(error);
            }else{
                connection.query('SELECT * FROM doctores WHERE doc_dni = ?', [req.session.DNIDOCTOR], async(error,results)=>{
                    if(error){
                        console.log(error);
                    }else{
                        req.session.loggedin=true;
                        req.session.NOMBREDOCTOR=results[0].doc_nombres+ " "+ results[0].doc_apellidos;
                        req.session.CORREODOCTOR=results[0].doc_email;
                        req.session.DNIDOCTOR=results[0].doc_dni;
                        req.session.TELEFONODOCTOR=results[0].doc_celular;
                        req.session.SEXODOC=results[0].doc_sexo;
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

                        res.render('doctor',{
                            npacientes:req.session.NUMEROPACIENTES
                        });
                    }
                })
            }
        });
})

 app.post('/doctor/EditCon',async(req,res)=>{
     const pass = req.body.pass;
     const npass = req.body.passwordNew1;
     const cpass = req.body.passwordNew2;
     if(pass && npass && cpass){
         connection.query('SELECT * FROM doctores WHERE doc_email = ?', [req.session.CORREODOCTOR], async(error,results)=>{
             if(pass != results[0].doc_contrasenia){
 
                 res.send("La contraseña actual es incorrecta.");
                 
             }else{
                 if(npass == pass){
                     res.send("La constraseña actual y la nueva no pueden ser iguales.")
                 }
                 else{
                     if(npass == cpass){
                         connection.query('UPDATE doctores SET doc_contrasenia=? WHERE doc_email=?',[npass,req.session.CORREODOCTOR],async(error,results)=>{
                             if(error){
                                 console.log(error);
                             }else{
                                 console.log('¡Contraseña cambiada! Por favor vuelve a loguearte.');
                                 req.session.destroy(() => {
                                     console.log('cerraste sesion');
                                     res.redirect('/login')
                                 })
                             }
                         })
                     }
                     else{
                         console.log('Las contraseñas no son iguales.');
                     }
                 }
             }
 
         })
     }
 })

 //guardar formulario paciente
 app.post('/paciente/guardarformulario',async(req,res)=>{
    console.log(req.body);
    var formatedMysqlString = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
    console.log( formatedMysqlString );
    var fechas=new Date();
    let sintom="";
    let enferme=""
    for(x of req.body.sintoma){
        sintom+=x+" ";
    }
    for(x of req.body.enfermedad){
        enferme+=x+" ";
    }
    console.log(sintom);

    
    connection.query('INSERT INTO formulario SET ?',{pac_dni:req.session.DNi,doc_dni:req.session.DNIDOCTOR1,temperatura:req.body.temp,saturacion:req.body.oxig,sintomas:sintom,enfermedades:enferme,fecha:fechas},async(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('paciente',{
                login:true,
                NOMBRE: req.session.NOMBRe,
                NDOC: req.session.NOMDOC,
                NCOR: req.session.CORDOC,
                CELDOC: req.session.CELULDOC,
                SEXODOC: req.session.SEXo
            });
        }
    })
    
 })

/* Contac Us Js usando nodemailer */
app.use('/',require('./routes/contact-us'));



///////////////////////SOCKETS//////////////////////
let ides = new Map();

let mensajes=[{dniE:"72865690",msje:"HOLA soy el 1",dniR:"72865650"},{dniE:"2",msje:"HOLA soy el 2",dniR:"1"},{dniE:"2",msje:"HOLA soy el 2",dniR:"3"}];
const SocketIO= require('socket.io');
const io=SocketIO(server);

//////////////////
io.on('connection',(socket)=>{
    socket.on('conectar',(data)=>{
        let mensajesDelchat=[];
        for(mensaje  of mensajes){
            if(mensaje.dniE==data.dni||mensaje.dniR==data.dni){
                mensajesDelchat.push(mensaje);
            }
        }
        ides.set(data.dni,socket.id);  
        console.log(data.dni,socket.id);
        io.to(socket.id).emit('inicio', mensajesDelchat);
    })
    socket.on('mensaje',(data)=>{
        mensajes.push({dniE:(data.dniE+""),msje:data.mensaje,dniR:(data.dniR+"")});
        console.log({dniE:(data.dniE+""),msje:data.mensaje,dniR:(data.dniR+"")},ides.get(data.dniR+""));
        io.to(ides.get(data.dniR)).emit('mensaje',{dniE:(data.dniE+""),msje:data.mensaje,dniR:(data.dniR+"")} );
    })
})
