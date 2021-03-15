var KEY="";
var KEY_Temas=""
var elementos_temas="";
var indice_tema="";
var nombre="";

$(document).ready(function(){
  llenar_listado_materias();
  //datosRegistroSeleccionado();
  $("#cargar_menu_preguntas").load("preguntas_listado_menu.html");
 
});  

$("#listado_materias").change(function(){
  KEY=$("#listado_materias").val();   
  console.log(KEY);
  llenar_listado_temas();
});  


$("#listado_temas").change(function(){
      KEY_Temas=$("#listado_temas").val();
      console.log(KEY_Temas);   
       llenar_listado_preguntas();
  });  




$("#datos_alumnos").on('submit', function(event) {
  event.preventDefault();
  actualizar_datos();
});  


function llenar_listado_materias(){

  var db=firebase.database();
  var ref=db.ref('lessons');

  ref.orderByChild("key").on("child_added", function(snapshot) {
         KEY=snapshot.key;
         nombre = snapshot.val().nombre;
        $('#listado_materias').append("<option value='" +  KEY   + "' >" +  nombre  + "</option>");
  });

 
}


function llenar_listado_temas(){
    console.log("Entro  *** " + KEY + "  *** a llenar temas");
    var db=firebase.database();


    var ref=db.ref('lessons');
    ref.orderByChild("nombre").on("child_added", function(snapshot) {
           //KEY_Temas=snapshot.key;
           topic = snapshot.val().topic;
           var i=0;
           elementos_temas="";
           topic.forEach(e => {
                elementos_temas=elementos_temas+"<option value='" +  i   + "' >" +  e  + "</option>";
                i=i+1;
           });
           $('#listado_temas').html(elementos_temas);
          
    });  

  }
  

  function llenar_listado_preguntas(){

    var db=firebase.database();
    var ref=db.ref('questions');
  
    ref.orderByChild("description").on("child_added", function(snapshot) {
           KEY=snapshot.key;
           description= snapshot.val().description;
          $('#listado_preguntas').append("<tr><td>" +  description + "</td>");

    });
  
   
  }

  function llenar_listado_temas2(){
      // Get a reference to the storage service, which is used to create references in your storage bucket
      var storage = firebase.storage();

      // Create a storage reference from our storage service
      var storageRef = storage.ref();
   
      // Create a child reference
      var imagesRef = storageRef.child('lessons/'+KEY).orderByChild("nombre").on("child_added", function(snapshot) {
    
        //KEY_Temas=snapshot.key;
               topic = snapshot.val().topic;
               var i=0;
               elementos_temas="";
               topic.forEach(e => {
                    elementos_temas=elementos_temas+"<option value='" +  i   + "' >" +  e  + "</option>";
               });
               $('#listado_temas').html(elementos_temas);
              
        });  



     // imagesRef now points to 'images'
     console.log("datos de la referencia: " + imagesRef );
  
    }


function llenar_formulario(){


    var db=firebase.database();
    var ref=db.ref('teachers/' +  KEY);
    
    ref.on("value", function(snapshot) { 
         //KEY=snapshot.key;
         //nombre = snapshot.val().nombre;
         //email =snapshot.val().email;
         //mensaje=snapshot.val().mensaje;

        
         //$("#alumno").val(nombre);
         //$("#correo").val(email);
         //$("#mensaje").val(mensaje);
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