$( document ).ready(function() {
    verificar_sesion();
});

function salir_sistema(){
    firebase.auth().signOut()
        .then(res=>{
            window.location.href = "/";
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

