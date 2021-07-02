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
    connection.query('INSERT INTO paciente SET ?',{pac_nacimiento:date,pac_dni:dni,pac_apellidos:lastname,pac_nombres:name,pac_email:mail,pac_contrasenia:passwordHaas,pac_celular:phone,pac_direccion:address},async(error,results)=>{
        if(error){
            console.log(error);
        }else{
           /* res.render('register',{
                alert:true,
                alertTitle: "Registration",
                alertMessage: "¡Successful Registration!",
                alertIcon:'succes',
                showConfirmButton:false,
                timer:1500,
                ruta:''
            })*/
            res.send('REGISTRO EXITOSO');
        }
    })
})
//11. autenticacion

app.post('/auth', async(req,res)=>{
    const user= req.body.user;
    const pass= req.body.pass;
    let passwordHaash=await bcryptjs.hash(pass,8);
    if(user && pass){
        connection.query('SELECT * FROM paciente WHERE pac_email = ?', [user], async(error,results)=>{
            if(results.length==0 || !(await bcryptjs.compare(pass,results[0].pac_contrasenia))){
                res.send("Email o contraseña incorrecta");
            }else{
                res.send('Login Correcto');
            }
        })
    }
})