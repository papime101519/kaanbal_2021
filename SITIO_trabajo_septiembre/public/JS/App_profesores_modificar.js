

var KEY="inicio";
var nombre="";
var email="";
var mensaje="";

$(document).ready(function(){
  llenar_listado_alumnos();
  //datosRegistroSeleccionado();
  $("#datos_alumnos").hide();
 
});  

$("#listado_alumnos").change(function(){

   
  KEY=$("#listado_alumnos").val();   
  console.log(KEY);
  llenar_formulario(); 
  datosRegistroSeleccionado();
  $("#datos_alumnos").show();

});  


$("#datos_alumnos").on('submit', function(event) {
  event.preventDefault();
  actualizar_datos();
});  


function llenar_listado_alumnos(){

 
  var db=firebase.database();
  var ref=db.ref('teachers');

  ref.orderByChild("nombre").on("child_added", function(snapshot) {
         KEY=snapshot.key;
         NOMBRE = snapshot.val().nombre;
         email =snapshot.val().email;
        $('#listado_alumnos').append("<option value='" +  KEY   + "' >" +  NOMBRE  + "</option>");
  });

  //KEY=$("#listado_alumnos").val();   
  //console.log(KEY);

}

function llenar_formulario(){

  //var db=firebase.database();
  //var ref=db.ref('teachers/'+KEY);
  //ref.orderByChild("nombre").on("child_added", function(snapshot) {

    var db=firebase.database();
    var ref=db.ref('teachers/' +  KEY);
    
    ref.on("value", function(snapshot) { 
         //KEY=snapshot.key;
         nombre = snapshot.val().nombre;
         email =snapshot.val().email;
         mensaje=snapshot.val().mensaje;

        
         $("#alumno").val(nombre);
         $("#correo").val(email);
         $("#mensaje").val(mensaje);
  });

}




function actualizar_datos(){

  //console.log("KEY: ", KEY);
  //console.log("nombre: ", $("#alumno").val());
  //console.log("email: ", $("#correo").val());
  //console.log("mensaje: ", $("#mensaje").val());

  var db=firebase.database();
  var ref=db.ref('teachers/'+KEY);

  //console.log("Referencia: " + ref );
  var usuario={
    nombre: $("#alumno").val(),
    email: $("#correo").val(),
    Mensaje: $("#mensaje").val()
  }
  
  ref.set(usuario);  //modificar un usuario existente

  alert("Registro actualizado");
 
  window.location.href = "modificar_profesores.html";
 
}


function datosRegistroSeleccionado(){
  var db=firebase.database();
  var ref=db.ref('teachers/' +  KEY);
  
  ref.on("value", function(snapshot) { 
         //KEY=snapshot.key;
         nombre = snapshot.val().nombre;
         email =snapshot.val().email;
         mensaje=snapshot.val().mensaje;

         console.log("KEY: ", KEY);
         console.log("nombre: ", nombre);
         console.log("email: ", email);
         console.log("mensaje: ",mensaje);

  });

}