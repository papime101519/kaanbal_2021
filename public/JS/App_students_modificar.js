
var alumno_seleccionado="";
var KEY="";

$(document).ready(function(){
    //alumno_seleccionado=$("#listado_alumnos").val();   
    //console.log("usuario: " + alumno_seleccionado);
    llenar_listado_alumnos();
    $("#datos_alumnos").hide();

});  



$("#listado_alumnos").change(function(){

  alumno_seleccionado=$("#listado_alumnos").val();   
  console.log(alumno_seleccionado);
  llenar_formulario(); 
  $("#datos_alumnos").show();
  

});  


$("#datos_alumnos").on('submit', function(event) {
  event.preventDefault();
  actualizar_datos();
});  


function llenar_listado_alumnos(){

 
  var db=firebase.database();
  var ref=db.ref('students');

  ref.orderByChild("nombre").on("child_added", function(snapshot) {
         var KEY=snapshot.key;
         var nombre = snapshot.val().nombre;
         var email =snapshot.val().email;
         var numCuenta=snapshot.val().numCuenta;
        $('#listado_alumnos').append("<option value='" +  numCuenta   + "' >" +  nombre  + "</option>");
  });

}

function llenar_formulario(){

  var db=firebase.database();
  var ref=db.ref('students');
  ref.orderByChild("numCuenta").equalTo(alumno_seleccionado).on("child_added", function(snapshot) {
         KEY=snapshot.key;
         var nombre = snapshot.val().nombre;
         var email =snapshot.val().email;
         var numCuenta=snapshot.val().numCuenta;
         var mensaje=snapshot.val().Mensaje;

        
         $("#alumno").val(nombre);
         $("#correo").val(email);
         $("#num_cuenta").val(numCuenta);
         $("#mensaje").val(mensaje);
  });

}




function actualizar_datos(){

  console.log("KEY: ", KEY);
  console.log("alumno_seleccionado: ", alumno_seleccionado);
  console.log("nombre: ", $("#alumno").val());
  console.log("email: ", $("#correo").val());
  console.log("mensaje: ", $("#mensaje").val());

  var db=firebase.database();
  var ref=db.ref('students/'+KEY);

  console.log("Referencia: " + ref );
  var usuario={
    nombre: $("#alumno").val(),
    email: $("#correo").val(),
    numCuenta:alumno_seleccionado,
    Mensaje: $("#mensaje").val()
  }
  
  ref.set(usuario);  //modificar un usuario existente

  alert("Registro actualizado");

  window.location.href = "modificar_alumnos.html";
}
