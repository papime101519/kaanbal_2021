
function entrarConGoogle2(){
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
            if (inf=null  || inf==undefined){
                console('Nuevo registro nuevo');
                return firebase.firestore.collection('teachers').doc(user.uid).set({
                    nombre:res.additionalUserInfo.profile.given_name,
                    email:user.email,
                    mensaje:""
                }).then(res=>{
                    console.log("salvo registro y debe entrar al sistema");
                    window.location.href = "menu_inicial.html"; 
                }).catch(err=>{
                    // se presento un error al salvar el nuevo registro
                    console.log('Se presento un error al salvar el nuevo registro');
                });
            } else {
                console.log('Ya existia el usuario en la base');
                window.location.href = "menu_inicial.html"; 
            }
        }).catch(err=>{
            console.log('Se presento un error al tratar de consultar el documento');
        });

    }).catch(err=>{
        console.log("No se pudo conectar a la base de datos,por favor vuelva a intentarlo");
    });
}
