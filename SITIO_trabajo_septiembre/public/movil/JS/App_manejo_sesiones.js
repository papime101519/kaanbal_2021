$( document ).ready(function() {
    verificar_sesion();
});


function salir_sistema(){
    firebase.auth().signOut()
        .then(res=>{
            window.location.href = "/webadmin/";
        }).catch(error=>{
            var errorCode = error.code;
            var errorMessage = error.message;
            mensaje='Se presento el siguiente error: ' + errorCode + errorMessage  ;
            console.log(mensaje);
        });

};



function verificar_sesion(){
    firebase.auth().onAuthStateChanged(res=>{
        if (res==null){
            window.location.href = "/";   
        } else {
            if(res.displayName!=null){
                //alert(res.displayName);
            } else {
                //alert(res.email);
            }
        }
    });

};



async  function obtener_usuarioR(){
   var id_usuario="ID";
   firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            
            id_usuario=firebase.auth().currentUser.uid;
            console.log(id_usuario)

        } else {
            id_usuario="No existe";
        }    
    });
    console.log('id_usuario en la funcion obtener: '+ id_usuario)
    return id_usuario;
    
}



function mandar_validacion_correo(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var emailVerified=user.emailVerified;
          if(emailVerified==false){
                    var usuario = firebase.auth().currentUser;
                    usuario.sendEmailVerification().then(function() {
                    // Email sent.
                    }).catch(function(error) {
                    // An error happened.
                    });
            } else {

            }
        } else {
          // No user is signed in.
        }
    });
}


