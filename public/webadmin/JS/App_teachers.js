

    $(document).ready(function(){
  


        var ref=firebase.database().ref('teachers/');
        ref.orderByChild("nombre").on("child_added", function(snapshot) {
      
          console.log("key: " + snapshot.key );
          console.log("Nombre: " + snapshot.val().nombre );
          console.log("Email: " + snapshot.val().email );
          console.log("mensaje: " + snapshot.val().numCuenta );
      
      
          $('#datos_alumnos').append("<tr><td>" +  snapshot.val().nombre   + "</td><td>" +  snapshot.val().email  + "</td><td>" +  snapshot.val().mensaje  + "</td></tr>");
      
      
      
        });
      
      
        
      
      });
      

