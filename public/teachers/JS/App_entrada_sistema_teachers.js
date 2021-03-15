$(document).ready(function() {
    $("#botones1").show();
 
});

$('#login').click(function(){
   entrarConGoogle();
});



function entrarConGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    firebase.auth().signInWithPopup(provider).then(res=>{
        // This gives you a Google Access Token.
        var token = res.credential.accessToken;
        // The signed-in user info.
        var user = res.user;
        //console.log("acepto credenciales");
        //window.location.href = "menu_inicial.html"; 
        return firebase.firestore().collection('teachers').doc(user.uid).get().then(el=>{
            var inf=el.data(); 
            console.log('Entro al documento');
            console.log(inf);
            if (inf=null  || inf==undefined){
                //mandar_validacion_correo();
                console.log('No existe el registro');
                return firebase.firestore().collection('teachers').doc(user.uid).set({
                    nombre:res.additionalUserInfo.profile.given_name,
                    email:user.email,
                    mensaje:''
                }).then(respuesta=>{
                    window.location.href = "menu_inicial.html"; 
                }).catch(err=>{
                    console.log('Se presento un error al llenar los campos del nuevo registro');
                });
            } else {
                console.log('Ya existe el registro');
                window.location.href = "menu_inicial.html"; 
            }

        }).catch(err=>{
            console.log('Se presento un error al tratar de consultar el documento');
        });

    }).catch(err=>{
        console.log("No se pudo conectar a la base de datos,por favor vuelva a intentarlo");
    });
}

