$(document).ready(function(){

});

$("#enviar").on('click', function(evt){
    evt.preventDefault(); 
    var nombre=($("#nombre").val()).trim();
    var email=($("#email").val()).trim();
    var mensaje=($("#mensaje").val()).trim();
    validacion_datos=validar_campos(nombre,email,mensaje);
    if (validacion_datos==1){
        mensaje_error='No se proporcionaron con el formato correctamente los datos'; 
        alert(mensaje_error);
    } else {
        alert('listo para agregar usuario');
    }
});



function validar_campos(nombre,email,mensaje){
    var validar=0;
    if(!validarEmail(email)) { validar=1; } 
    if(nombre.length<=0) { validar=1; } 
    if(mensaje.length<=0) { validar=1; } 
    return validar;
}

function validarEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test( $email );
  }