$(document).ready(function(){
    combo_profesores();
    $("#datos_profesores").hide();

});  



$("#listado_profesores").change(function(){

  profesor_seleccionado=$("#listado_profesores").val();   
  llenar_formulario(profesor_seleccionado); 
  if (profesor_seleccionado!=0){
      $("#datos_profesores").show();
  } else {
    $("#datos_profesores").hide();
  }
  

});  


function combo_profesores(){

  firebase.firestore().collection('teachers')
	.onSnapshot(res=>{
		llenarProfesores(res);
	});

}

function llenarProfesores(res){
	res.forEach(rpta=>{
		var fila= rpta.data();
		var KEY=rpta.id;
    var nombre = fila.nombre;
    $('#listado_profesores').append("<option value='" +  KEY   + "' >" +  nombre  + "</option>");
  });	
}


function llenar_formulario(profesor_seleccionado){

  firebase.firestore().collection('teachers').doc(profesor_seleccionado).get().then(res=>{
    var datos=res.data();
    $("#clave_profesor").val(profesor_seleccionado);
    $("#nombre").val(datos.nombre);
    $("#email").val(datos.email);
    $("#mensaje").val(datos.mensaje);
  }).catch(err=>{
     //console.log('Ocurrio un error');

  });

}




function actualizar_datos(){

  console.log("KEY: ", KEY);
  console.log("profesor_seleccionado: ", profesor_seleccionado);
  console.log("nombre: ", $("#alumno").val());
  console.log("email: ", $("#correo").val());
  console.log("mensaje: ", $("#mensaje").val());

  var db=firebase.database();
  var ref=db.ref('teachers/'+KEY);

  console.log("Referencia: " + ref );
  var usuario={
    nombre: $("#alumno").val(),
    email: $("#correo").val(),
    numCuenta:profesor_seleccionado,
    Mensaje: $("#mensaje").val()
  }
  
  ref.set(usuario);  //modificar un usuario existente

  alert("Registro actualizado");

  //window.location.href = "modificar_profesores.html";
  location.reload();
}



$("#salvar").on('click', function(evt){
  evt.preventDefault(); 
  var nombre=($("#nombre").val()).trim();
  var email=($("#email").val()).trim();
  var mensaje=($("#mensaje").val()).trim();
  var idAlumno=($("#clave_profesor").val()).trim();
  validacion_datos=validar_campos(nombre,email,mensaje);
  if (validacion_datos==1){
      mensaje_error='No se proporcionaron con el formato correctamente los datos.'; 
      alert(mensaje_error);
  } else {
      /////////////////////////////////////////////////
      firebase.firestore().collection('teachers').doc(idAlumno)
      .update({
            nombre:nombre,
            email:email,
            mensaje:mensaje
      }).then(res=>{
          alert('Se actualizo correctamente el registro');
          //window.location.href = "modificar_profesores.html"; 
          location.reload();
      }).catch(err=>{
        // error 
      })
    

      ////////////////////////////////////////////////
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