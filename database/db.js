const mysql =require('mysql');
const connection =mysql.createConnection({
    host: process.env.HOST || "localhost",
    database: process.env.DATABASE || "covidtrack",
    user: process.env.USER || "root",
    password: process.env.PASSWORD || "123456",
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