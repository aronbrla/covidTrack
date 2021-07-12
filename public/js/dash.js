document.getElementById("info").style.display = "block";
document.getElementById("doc").style.display = "none";
document.getElementById("cita").style.display = "none";
document.getElementById("ajustes").style.display = "none";
document.getElementById("seguimiento").style.display = "none";
document.getElementById("cerrar").style.display = "none";

document.querySelector("#ajustes .region input").style.display="none";
document.querySelector("#ajustes .distrito input").style.display="none";
document.querySelector("#ajustes .direccion input").style.display="none";
document.querySelector("#ajustes .correo input").style.display="none";
document.querySelector("#ajustes .telefono input").style.display="none";
document.querySelector("#ajustes .clave input").style.display="none";

function editar(X){
    if(document.querySelector("#ajustes ."+X+" input").style.display=="none"){
        document.querySelector("#ajustes ."+X+" input").style.display="block";
        document.querySelector("#ajustes ."+X+" span").style.display="none";
        document.querySelector("#ajustes ."+X+" a").innerHTML="Cancelar";
    }else{
        document.querySelector("#ajustes ."+X+" input").style.display="none";
        document.querySelector("#ajustes ."+X+" span").style.display="block";
        document.querySelector("#ajustes ."+X+" a").innerHTML="Editar";
    }
}



function info(){
    document.getElementById("info").style.display = "block";
    document.getElementById("doc").style.display = "none";
    document.getElementById("cita").style.display = "none";
    document.getElementById("ajustes").style.display = "none";
    document.getElementById("seguimiento").style.display = "none";
    document.getElementById("cerrar").style.display = "none";
}

function doc(){
    document.getElementById("info").style.display = "none";
    document.getElementById("doc").style.display = "block";
    document.getElementById("cita").style.display = "none";
    document.getElementById("ajustes").style.display = "none";
    document.getElementById("seguimiento").style.display = "none";
    document.getElementById("cerrar").style.display = "none";
}
function cita(){
    document.getElementById("info").style.display = "none";
    document.getElementById("doc").style.display = "none";
    document.getElementById("cita").style.display = "block";
    document.getElementById("ajustes").style.display = "none";
    document.getElementById("seguimiento").style.display = "none";
    document.getElementById("cerrar").style.display = "none";
}

function adj(){
    document.getElementById("info").style.display = "none";
    document.getElementById("doc").style.display = "none";
    document.getElementById("cita").style.display = "none";
    document.getElementById("ajustes").style.display = "block";
    document.getElementById("seguimiento").style.display = "none";
    document.getElementById("cerrar").style.display = "none";
}
function seg(){
    document.getElementById("info").style.display = "none";
    document.getElementById("doc").style.display = "none";
    document.getElementById("cita").style.display = "none";
    document.getElementById("ajustes").style.display = "none";
    document.getElementById("seguimiento").style.display = "block";
    document.getElementById("cerrar").style.display = "none";
}
function cer(){
    
}

function ajustes(){
    document.getElementById("info").style.display = "none";
    document.getElementById("doc").style.display = "none";
    document.getElementById("cita").style.display = "none";
    document.getElementById("ajustes").style.display = "block";
    document.getElementById("seguimiento").style.display = "none";
    document.getElementById("cerrar").style.display = "none";

}
