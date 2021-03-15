$(document).ready(function(){
    llenar_formulario();
});  

  

async function llenar_formulario(){

    await firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var profesor_seleccionado=user.uid;
            firebase.firestore().collection('teachers').doc(profesor_seleccionado).get().then(res=>{
                var datos=res.data();
                $("#clave_profesor").val(profesor_seleccionado);
                $("#nombre").val(datos.nombre);
                $("#mensaje").val(datos.mensaje);
            }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);});
        } else {
        // No user is signed in.
        }
    });


   

}




async function actualizar_datos(){

  console.log("KEY: ", KEY);
  console.log("profesor_seleccionado: ", profesor_seleccionado);
  console.log("nombre: ", $("#alumno").val());
  console.log("mensaje: ", $("#mensaje").val());

  var db=firebase.database();
  var ref=db.ref('students/'+KEY);

  console.log("Referencia: " + ref );
  var usuario={
    nombre: $("#alumno").val(),
    numCuenta:profesor_seleccionado,
    Mensaje: $("#mensaje").val()
  }
  
  ref.set(usuario);  //modificar un usuario existente

  alert("Registro actualizado");

  
  location.reload();
}



$("#salvar").on('click', function(evt){
  evt.preventDefault(); 
  var nombre=($("#nombre").val()).trim();
  var mensaje=($("#mensaje").val()).trim();
  var idProfesor=($("#clave_profesor").val()).trim();
  validacion_datos=validar_campos(nombre,mensaje);
  if (validacion_datos==1){
      mensaje_error='No se proporcionaron con el formato correctamente los datos.'; 
      alert(mensaje_error);
  } else {
      /////////////////////////////////////////////////
      firebase.firestore().collection('teachers').doc(idProfesor)
      .update({
            nombre:nombre,
            mensaje:mensaje
      }).then(res=>{
          alert('Se actualizaron correctamente sus datos');
          location.reload();
      }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
    

      ////////////////////////////////////////////////
  }

});


function validar_campos(nombre,mensaje){
  var validar=0;
  if(nombre.length<=0) { validar=1; } 
  if(mensaje.length<=0) { validar=1; } 
  return validar;
}

function validarEmail($email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailReg.test( $email );
}




function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}
