const mysql =require('mysql');
const connection =mysql.createConnection({
    host: "localhost",
    database: "covidtrack",
    user: "root",
    password: "",
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