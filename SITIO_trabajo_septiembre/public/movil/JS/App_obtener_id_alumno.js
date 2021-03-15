var id_materia=0;
var id_usuario=0;


$(document).ready(function(){
    inicializar_pagina();
});  


async  function inicializar_pagina (){
    const id_usuario= await obtener_usuario();
 }
 
 
 async  function obtener_usuario(){
     firebase.auth().onAuthStateChanged(function(user) {
           if (user) {
               id_usuario=firebase.auth().currentUser.uid;
               datos_alumno_actual(id_usuario);
           } else {
               id_usuario="No existe";
           }    
       });     
   }
  
 
   async function datos_alumno_actual(){
        $('#listado_datos_alumno').empty();
        $('#listado_datos_alumno').append("<center>Clave Alumno: <br><h4> <span class='text-danger  font-weight-bold'> " + id_usuario+" </span></h4> </center>");

 }
 
 
function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}
