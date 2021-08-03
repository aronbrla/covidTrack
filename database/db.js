const mysql =require('mysql');
const connection =mysql.createConnection({
    host: "us-cdbr-east-04.cleardb.com" || "localhost",
    database: "heroku_c960b61942b19d8" || "covidtrack",
    user: 'b9bce1223109e1' || "root",
    password: '141d05d2' || "",
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