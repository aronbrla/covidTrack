const mysql =require('mysql');
const connection =mysql.createConnection({
    host: process.env.HOST,
    database:process.env.DATABASE,
    user: process.env.USER,
    password:process.env.PASSWORD,
    multipleStatements: true
});
connection.connect((error)=>{
    if(error){
        console.log('Error: '+error);
        return;
    } 
    console.log('CONECTADO A LA BASE DE DATOS!');
});
module.exports=connection;