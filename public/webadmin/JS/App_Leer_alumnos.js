$('#leer').click(function(){
  
        var ref=firebase.database().ref('students');

        $('#root').append("<table><tr><th>Nombre</th><th>email</th><th>numCuenta</th></tr>");


        ref.orderByChild("nombre").on("child_added", function(snapshot) {

        
          $('#root').append("<tr>");


          console.log("key: " + snapshot.key );
          console.log("Nombre: " + snapshot.val().nombre );
          console.log("Email: " + snapshot.val().email );
          console.log("Email: " + snapshot.val().email );


          $('#root').append("<td>" +  snapshot.val().nombre  + "' </td>");
          $('#root').append("<td>" +  snapshot.val().email  + "' </td>");
          $('#root').append("<td>" +  snapshot.val().numCuenta  + "' </td>");



          $('#root').append("</tr>");



        });

        $('#root').append("AAA</table>");

});
  
  
  
  

