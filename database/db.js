const mysql =require('mysql');
const connection =mysql.createConnection({
    host: process.env.HOST || "us-cdbr-east-04.cleardb.com",
    database:process.env.DATABASE ||  "heroku_c960b61942b19d8",
    user: process.env.USER ||"b9bce1223109e1",// 
    password:process.env.PASSWORD || "141d05d2",// 
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