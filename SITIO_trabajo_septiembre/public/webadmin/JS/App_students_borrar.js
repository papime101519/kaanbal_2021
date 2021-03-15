
var alumno_seleccionado="";
var KEY="";
var nombre="";
var email="";
var numCuenta="";
var mensaje="";

$('#AvisoBorrar').hide();
$('#botonesBorrar').hide();

$(document).ready(function(){
      llenar_listado_alumnos();
});  

$("#listado_alumnos").change(function(){

  alumno_seleccionado=$("#listado_alumnos").val();   
  console.log(alumno_seleccionado);
  datosAlumnoSeleccionado();
  activarBotones();



});  


$("#datos_alumnos").on('submit', function(event) {
  event.preventDefault();
});  

$('#botonCancelar').on('click', function(){
  $('#AvisoBorrar').hide();
  $('#botonesBorrar').hide();
});

$('#botonsalvar').on('click', function(){
      borrarDatos();
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

function activarBotones(){
  $('#AvisoBorrar').show();
  $('#botonesBorrar').show();
  $("#letrero").html(nombre);
  
}



function borrarDatos(){
    
   datosAlumnoSeleccionado();

      var db=firebase.database();
      var ref=db.ref('students');
      ref.child(KEY).remove();

    $('#AvisoBorrar').hide();
    $('#botonesBorrar').hide();
    alert("El alumno fue borrado","Aviso");
    //window.location.reload;
    window.location.href = 'menu_alumnos.html';
    
}

function datosAlumnoSeleccionado(){
  var db=firebase.database();
  var ref=db.ref('students');
  ref.orderByChild("numCuenta").equalTo(alumno_seleccionado).on("child_added", function(snapshot) {
         KEY=snapshot.key;
         nombre = snapshot.val().nombre;
         email =snapshot.val().email;
         numCuenta=snapshot.val().numCuenta;
         mensaje=snapshot.val().Mensaje;

         console.log("KEY: ", KEY);
         console.log("alumno_seleccionado: ", alumno_seleccionado);
         console.log("nombre: ", nombre);
         console.log("email: ", email);
         console.log("mensaje: ",mensaje);

  });

}



