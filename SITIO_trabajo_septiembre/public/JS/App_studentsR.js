

  $(document).ready(function(){
  

  var db=firebase.database();
  var ref=db.ref('students');
  
  ref.orderByChild("nombre").on("child_added", function(snapshot) {
  //ref.orderByChild("numCuenta").equalTo("041123558").on("child_added", function(snapshot) {

         var KEY=snapshot.key;
         var nombre = snapshot.val().nombre;
         var email =snapshot.val().email;
         var numCuenta=snapshot.val().numCuenta;
         
        $('#datos_alumnos').append("<tr><td>" +  numCuenta   + "</td><td>" +  nombre  + "</td><td>" +  email  + "</td></tr>");


  });

});



$("#listado_alumnos").click(function(){
  var db=firebase.database();
  var ref=db.ref('students');

  ref.orderByChild("nombre").on("child_added", function(snapshot) {
         var KEY=snapshot.key;
         var nombre = snapshot.val().nombre;
         var email =snapshot.val().email;
         var numCuenta=snapshot.val().numCuenta;
        $('#listado_alumnos').append("<option value='" +  numCuenta   + "' >" +  nombre  + "</option>");
  });

});  

