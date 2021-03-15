$(document).ready(function(){
    llenar_formulario();
});  

  

function llenar_formulario(){

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var alumno_seleccionado=user.uid;
            //alert(alumno_seleccionado)
            firebase.firestore().collection('teachers').doc(alumno_seleccionado).get().then(res=>{
                var datos=res.data();
                $("#clave_alumno").val(alumno_seleccionado);
                $("#nombre").val(datos.nombre);
                //$("#email").val(datos.email);
                $("#mensaje").val(datos.mensaje);
              }).catch(err=>{
                //console.log('Ocurrio un error');
          
              });
        } else {
        // No user is signed in.
        }
    });


   

}




function actualizar_datos(){

  console.log("KEY: ", KEY);
  console.log("alumno_seleccionado: ", alumno_seleccionado);
  console.log("nombre: ", $("#alumno").val());
  console.log("mensaje: ", $("#mensaje").val());

  var db=firebase.database();
  var ref=db.ref('students/'+KEY);

  console.log("Referencia: " + ref );
  var usuario={
    nombre: $("#alumno").val(),
    numCuenta:alumno_seleccionado,
    Mensaje: $("#mensaje").val()
  }
  
  ref.set(usuario);  //modificar un usuario existente

  alert("Registro actualizado");

  //window.location.href = "modificar_alumnos.html";
  location.reload();
}



$("#salvar").on('click', function(evt){
  evt.preventDefault(); 
  var nombre=($("#nombre").val()).trim();
  var mensaje=($("#mensaje").val()).trim();
  var idAlumno=($("#clave_alumno").val()).trim();
  validacion_datos=validar_campos(nombre,mensaje);
  if (validacion_datos==1){
      mensaje_error='No se proporcionaron con el formato correctamente los datos.'; 
      alert(mensaje_error);
  } else {
      /////////////////////////////////////////////////
      firebase.firestore().collection('students').doc(idAlumno)
      .update({
            nombre:nombre,
            mensaje:mensaje
      }).then(res=>{
          alert('Se actualizo correctamente el registro');
          //window.location.href = "modificar_alumnos.html"; 
          location.reload();
      }).catch(err=>{
        // error 
      })
    

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