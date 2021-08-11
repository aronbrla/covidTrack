const mysql =require('mysql');
const connection =mysql.createConnection({
    host: "localhost",//process.env.HOST || 
    database: "covidtrack",//process.env.DATABASE || 
    user: "root",//process.env.USER || 
    password: "",//process.env.PASSWORD || 
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