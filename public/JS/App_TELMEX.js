

$('#guardar').hide();

$('#login').click(function(){
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        guardaDatos(user);
        $('#login').hide();
        $('#root').append("<img src='"+ user.photoURL  + "' />");
        $('#guardar').show();
    });
});


function guardaDatos(user){
  var usuario={
    uid: user.uid,
    nombre: user.displayName,
    email:user.email,
    foto:user.photoURL
  }
  //firebase.database().ref('Telmex').push(usuario);   //agrega nuevos elementos pero se repetite el usuario
  firebase.database().ref('Telmex/'+ usuario.uid).set(usuario);  //modificar un usuario existente
  console.log('Ejecuto guardar datos');

}

function leerBasedatos(){

        var ref=firebase.database().ref('Telmex');

        ref.orderByChild("nombre").on("child_added", function(snapshot) {
          console.log("key: " + snapshot.key );
          console.log("Nombre: " + snapshot.val().nombre );
          console.log("Foto: " + snapshot.val().foto );
          console.log("Email: " + snapshot.val().email );
        });

        /*
        firebase.database().ref('Telmex').on('child_added',function(s){
         
        var user=s.val();
              var nombre=user.displayName;
              console.log(nombre);
        })
        */
}

$('#guardar').click(function(){
        var usuario={
          nombre: "MANUEL",
          edad: 45,
          sexo: "Masculinoxxxx2"
        }  
        firebase.database().ref('Telmex').set(usuario);
        console.log('Ejecuto despues de presionar el boton de guardar');

}); 


$('#nombre').click(function(){
      leerBasedatos();

}); 