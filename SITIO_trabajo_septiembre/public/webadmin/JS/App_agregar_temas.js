
var id_materia= getParameterByName('id_materia');
var nombre_materia= getParameterByName('nombre_materia');

var nombre_tema="";
var clave_tema="";

$(document).ready(function(){
    inicializar_pagina();
});  

async  function inicializar_pagina (){

    $("#letrero_nombre_materia").empty();
    $("#letrero_nombre_materia").append("<center>"+nombre_materia+ " - Agregar tema</center>");

    
}
  

$("#enviar").on('click', function(evt){
    evt.preventDefault();
    
    salvar_datos();
});


$("#regresar").on('click', function (evt) {
    evt.preventDefault();
    window.history.back();
    //window.location.href = "preguntas_listado_por_temas.html"; 
});


async function salvar_datos(){
    

   

    nombre_tema=($("#nombre").val()).trim();
    clave_tema=($("#clave").val()).trim();
 
    

    validacion_datos=validar_campos(nombre_tema,clave_tema);

    if (validacion_datos==1){
        mensaje_error='Los campos no deben estar vacios y el número de tema debe ser un valor entero.'; 
        alert(mensaje_error);
    } else {
        //alert("nombre= "+nombre_tema+" clave= "  +clave_tema)
         await salvar_tema();
              
    }
}


async  function salvar_tema (){
    
    await firebase.firestore().collection('lessons').doc(id_materia).collection("Temas")
    .add({
          nombre:nombre_tema,
          num_tema:parseInt(clave_tema),
          num_cuestionarios:0,
          porcentaje_materia:0
    }).then(res=>{
        
        alert('Se agrego correctamente el tema');
        window.history.back(); 
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})

    
}
  

function validar_campos(nombre,clave){
    var validar=0;
    if(Number.isInteger(parseFloat(clave))){validar=0} else {validar=1;}
    if(nombre.length<=0) { validar=1; } 
    if(clave.length<=0) { validar=1; }
    


    return validar;
  }
  


function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}