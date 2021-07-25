const express =require('express');//1.importando libreria
const app =express(); 
//montando el servidor en la ruta 3000
app.listen(3000,function(peticion,respuesta){console.log('SERVER RUNNING IN http://localhost:3000');
});

//2. seteamos urlencoded para capturar datos del formulario
app.use(express.urlencoded({extended:false}));
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
    //encriptando la contraseña
    let passwordHaas=await bcryptjs.hash(pass,8);
    //buscamos correo y dni, si ya están en la base de datos no podrá registrarse:
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
                            connection.query('INSERT INTO paciente SET ?',{pac_nacimiento:date,pac_dni:dni,pac_apellidos:lastname,pac_nombres:name,pac_email:mail,pac_contrasenia:passwordHaas,pac_celular:phone,pac_direccion:address},async(error,results)=>{
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
    var mail="";
    var name="";
    var lastname="";
    var pdni="";
    var adress="";
    var phone="";
    var date="";
    let passwordHaash=await bcryptjs.hash(pass,8);
    if(user && pass){
        if(tipouser=="paciente"){
            connection.query('SELECT * FROM paciente WHERE pac_email = ?', [user], async(error,results)=>{
                if(results.length==0 || !(await bcryptjs.compare(pass,results[0].pac_contrasenia))){
                    
                    res.send("Email o contraseña incorrecta");
                    
                }else{
                    
                    connection.query('SELECT * FROM paciente', [user], async(error,results)=>{
                        if(error){
                            console.log(error);
                        }else{
                            req.session.loggedin=true;
                            req.session.NOMBRe=results[0].pac_nombres+ " "+ results[0].pac_apellidos;
                            req.session.CORREo=results[0].pac_email;
                            req.session.DIRECCIOn=results[0].pac_direccion;
                            req.session.DNi=results[0].pac_dni;
                            req.session.TELEFONo=results[0].pac_celular;
                            req.session.DISTRITo="Chimbote";
                            req.session.EDAd=results[0].pac_nacimiento;
                            req.session.SEXo='M o F';
                           
                            mail=results[0].pac_email;
                            name=results[0].pac_nombres + " " + results[0].pac_apellidos;
                            lastname=results[0].pac_apellidos;
                            pdni=results[0].pac_dni;
                            adress=results[0].pac_direccion;
                            phone=results[0].pac_celular;
                            date=results[0].pac_nacimiento;
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

                            /*res.render('dash',{NOMBRE:name,EDAD:edad,DNI:pdni, REGION:region,SEXO:sexo,DISTRITO:distrito,
                            DIRECCION:adress,CORREO:mail,TELEFONO:phone,DR:doctor,TELEDR:telefonoDoctor,
                            CORREODR:correoDoctor,DNIDR:dniDoctor,LAST:ultimaCita,NEXT:proximaCita
                            });*/

                            res.render('paciente',{
                                ruta:''
                            });
                        }
                    })
                    
                }
            })
        }else{
            connection.query('SELECT * FROM doctores WHERE doc_email = ?', [user], async(error,results)=>{
                if(results.length==0 || !(await bcryptjs.compare(pass,results[0].pac_contrasenia))){
                    res.send("Email o contraseña incorrecta");
                }else{
                    res.send('Login Correcto');
                }
            }) 
        }
     
    } else{
        res.send('Porfavor ingresa un usuario y contraseña!');
        res.end();
    }
});

//12. auth page

//13. Logout
//Destruye la sesión.
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/login') // siempre se ejecutará después de que se destruya la sesión
	})
});

//función para limpiar la caché luego del logout
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});
