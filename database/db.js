const mysql =require('mysql');
const connection =mysql.createConnection({
    host: "localhost",//process.env.HOST || "localhost",
    database:  "covidtrack",   //process.env.DATABASE ||  "covidtrack",
    user:"root",// process.env.USER ||"root",
    password:"",//process.env.PASSWORD || "",
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