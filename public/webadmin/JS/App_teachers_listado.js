var id_profesor=0;
$(document).ready(function(){
    listado_profesores();
});


function listado_profesores(){
	firebase.firestore().collection('teachers')
	.onSnapshot(res=>{
		llenarProfesores(res);
	});
}

function llenarProfesores(res){
    $('#datos_profesores').empty();
	res.forEach(rpta=>{
		var fila= rpta.data();
		var clave=rpta.id;
		var nombre = fila.nombre;
		var email=fila.email;
		var mensaje=fila.mensaje;
		$('#datos_profesores').append("<tr><td>" +  nombre   + "</td><td>" +  email  + "</td><td>" +  mensaje + "</td><td><button type='button' class='btn btn-dark text-center' data-toggle='modal' data-target='#modificar_profesores'   onclick='modificar(\"" + clave + "\");'>Modificar</button></td><td><button type='button' class='btn btn-dark text-center'  data-toggle='modal' data-target='#borrar_profesores'  onclick='borrar(\"" + clave + "\");'>Borrar</button></td></tr>");
        
    });	
}


function modificar(clave){ 
    //alert('modificar');
    llenar_formulario(clave)
    
}
function borrar(clave){
    //alert('borrar');
    id_profesor=clave;

}

$("#eliminar").on('click', function(evt){
    
    firebase.firestore().collection('teachers').doc(id_profesor).delete().then(res=>{
        location.reload();
    }).catch(err=>{
        // en caso de error
    });
})


$("#actualizar").on('click', function(evt){
    //$('#lista_alumnos').hide();
    evt.preventDefault(); 
    var nombre=($("#nombre2").val()).trim();
    var email=($("#email2").val()).trim();
    var mensaje=($("#mensaje2").val()).trim();
    var idProfesor=($("#clave_profesor2").val()).trim();
    validacion_datos=validar_campos(nombre,email,mensaje);
    if (validacion_datos==1){
        mensaje_error='No se proporcionaron con el formato correctamente los datos.'; 
        alert(mensaje_error);
    } else {

        
        /////////////////////////////////////////////////
        firebase.firestore().collection('teachers').doc(idProfesor)
        .update({
              nombre:nombre,
              email:email,
              mensaje:mensaje
        }).then(res=>{
            
            alert('Se actualizo correctamente el registro');
            location.reload(); 
            //$('#lista_alumnos').show();
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


  
function llenar_formulario(profesesor_seleccionado){

    firebase.firestore().collection('teachers').doc(profesesor_seleccionado).get().then(res=>{
      var datos=res.data();
      $("#clave_profesor2").val(profesesor_seleccionado);
      $("#nombre2").val(datos.nombre);
      $("#email2").val(datos.email);
      $("#mensaje2").val(datos.mensaje);
    }).catch(err=>{
       //console.log('Ocurrio un error');
  
    });
  
  }
  