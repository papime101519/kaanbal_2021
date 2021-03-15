
var KEY="";
var nombre="";
var email="";
var mensaje="";

$('#AvisoBorrar').hide();
$('#botonesBorrar').hide();

$(document).ready(function(){
      llenar_listado_alumnos();
});  

$("#listado_alumnos").change(function(){

  KEY=$("#listado_alumnos").val();   
  console.log(KEY);
  datosRegistroSeleccionado();
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
  var ref=db.ref('teachers/');

  ref.orderByChild("nombre").on("child_added", function(snapshot) {
         KEY=snapshot.key;
         nombre = snapshot.val().nombre;
        $('#listado_alumnos').append("<option value='" + KEY  + "' >" +  nombre  + "</option>");
  });

}

function activarBotones(){

  $('#AvisoBorrar').show();
  $('#botonesBorrar').show();
  $("#letrero").html(nombre);
  
}



function borrarDatos(){
    
   //datosAlumnoSeleccionado();
      console.log(KEY)
      var db=firebase.database();
      var ref=db.ref('teachers/');
      ref.child(KEY).remove();

    $('#AvisoBorrar').hide();
    $('#botonesBorrar').hide();
    alert("El profesor fue borrado","Aviso");
    //window.location.reload;
    window.location.href = 'menu_profesores.html';
    
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


