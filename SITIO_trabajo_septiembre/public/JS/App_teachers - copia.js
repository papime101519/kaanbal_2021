
$('#guardar').click(function(){

var usuario={nombre:"Libby Burns",email:"vitae.aliquam@Suspendisseacmetus.org", mensaje:"dignissim pharetra. Nam ac nulla." } ;   firebase.database().ref('teachers/').push(usuario);   console.log('Ejecuto despues de  presionar el boton de guardar');
var usuario={nombre:"Lisandra Hale",email:"amet.risus@Integer.ca", mensaje:"imperdiet non, vestibulum nec, euismod" } ;   firebase.database().ref('teachers/').push(usuario);   console.log('Ejecuto despues de  presionar el boton de guardar');
var usuario={nombre:"Cecilia Jones",email:"a@cubilia.edu", mensaje:"quam vel sapien imperdiet ornare." } ;   firebase.database().ref('teachers/').push(usuario);   console.log('Ejecuto despues de  presionar el boton de guardar');
var usuario={nombre:"Simone Francis",email:"vel.vulputate@enimcommodohendrerit.com", mensaje:"Mauris vel turpis. Aliquam adipiscing" } ;   firebase.database().ref('teachers/').push(usuario);   console.log('Ejecuto despues de  presionar el boton de guardar');
var usuario={nombre:"Rowan Greer",email:"Nullam.lobortis@Quisquetincidunt.com", mensaje:"et risus. Quisque libero lacus," } ;   firebase.database().ref('teachers/').push(usuario);   console.log('Ejecuto despues de  presionar el boton de guardar');
var usuario={nombre:"Hanna Hughes",email:"dolor@lorem.co.uk", mensaje:"tempor augue ac ipsum. Phasellus" } ;   firebase.database().ref('teachers/').push(usuario);   console.log('Ejecuto despues de  presionar el boton de guardar');
var usuario={nombre:"Gloria Riggs	",email:"tellus.id@vitaerisus.org", mensaje:"rutrum. Fusce dolor quam, elementum" } ;   firebase.database().ref('teachers/').push(usuario);   console.log('Ejecuto despues de  presionar el boton de guardar');
var usuario={nombre:"Amethyst Mcfadden",email:"ipsum.Suspendisse@urnanecluctus.edu", mensaje:"tempus, lorem fringilla ornare placerat," } ;   firebase.database().ref('teachers/').push(usuario);   console.log('Ejecuto despues de  presionar el boton de guardar');
var usuario={nombre:"Amena Hatfield",email:"Maecenas.mi@ultrices.net", mensaje:"arcu. Morbi sit amet massa." } ;   firebase.database().ref('teachers/').push(usuario);   console.log('Ejecuto despues de  presionar el boton de guardar');
var usuario={nombre:"Jacqueline Campos",email:"neque.Morbi.quis@ornare.co.uk", mensaje:"euismod est arcu ac orci." } ;   firebase.database().ref('teachers/').push(usuario);   console.log('Ejecuto despues de  presionar el boton de guardar');
var usuario={nombre:"Aurora Lambert",email:"erat@eleifendCrassed.ca", mensaje:"felis ullamcorper viverra. Maecenas iaculis" } ;   firebase.database().ref('teachers/').push(usuario);   console.log('Ejecuto despues de  presionar el boton de guardar');

});




//$('#leer').click(function(){
  

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
      

