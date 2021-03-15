$(document).ready(function() {
    $("#botones1").show();
    $("#botones2").hide();
});

$('#crear').click(function(){
    $("#botones1").hide();
    $("#botones2").show();
    
});

$('#cancelar').click(function(){
    $("#correo").val('');
    $("#clave").val('');
    $("#botones1").show();
    $("#botones2").hide();
});


$('#login').click(function(){
   entrarConGoogle2();
});


function entrarConGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        //console.log(user);
        window.location.href = "menu_inicial.html";      
    });

}


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
            console.log('Entro al documento');
            console.log(inf);
            if (inf=null  || inf==undefined){
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

$("#salvar").on('click', function(evt){
    evt.preventDefault(); 
    validacion_datos=validar_campos();
    if (validacion_datos==1){
        $("#aviso_agregar").text('No se proporcionaron con el formato correctamente los datos: Se debe proporcionar un correo valido y La clave debe tener al menos 8 digitos '); 
        $("#mostrarmodal").modal("toggle");
    } else {
        guardar_datos(); 
    }
});


$("#entrar").on('click', function(evt){
    evt.preventDefault(); 
    validacion_datos=validar_campos();
    if (validacion_datos==1){
        $("#aviso_agregar").text('No se proporcionaron con el formato correctamente los datos: Se debe proporcionar un correo valido y La clave debe tener al menos 8 digitos '); 
        $("#mostrarmodal").modal("toggle");
    } else {
        entrar_sistema(); 
    }
});




function validar_campos(){
    var validar=0;
    valor1=($("#correo").val()).trim();
    valor2=($("#clave").val()).trim();
    //console.log(valor1);
    //console.log(valor2);
    //console.log(valor2.length);
    
    
    if(!validarEmail(valor1)) { validar=1; } 
    if(valor2.length<=7) { validar=1; } 
    return validar;


}

function validarEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test( $email );
  }

function guardar_datos(){
        var email=$("#correo").val(); 
        var password=$("#clave").val();
        var mensaje=""; 
        firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(res=>{
            mensaje='Se registro correctamente su correo electrónico';
            $("#aviso_agregar").text(mensaje);
            $("#mostrarmodal").modal("toggle")
            $("#correo").val('');
            $("#clave").val('');
            $("#botones1").show();
            $("#botones2").hide();
            firebase.auth().signOut();
            //guardar_correo_nuevo(res,email);
        }).catch(error=>{
            var errorCode = error.code;
            var errorMessage = error.message;
            mensaje='Se presento el siguiente error: ' + errorCode + errorMessage  ;
            $("#aviso_agregar").text(mensaje);
            $("#mostrarmodal").modal("toggle")
        });

};


function entrar_sistema(){
    var email=$("#correo").val(); 
    var password=$("#clave").val();
    var mensaje=""; 
    
    firebase.auth().signInWithEmailAndPassword(email,password)
    .then(res=>{

        guardar_correo_nuevo(res,email)
        //window.location.href = "menu_inicial.html"; 

    }).catch(error=>{
        var errorCode = error.code;
        var errorMessage = error.message;
        mensaje='Se presento el siguiente error: ' + errorCode + errorMessage  ;
        $("#aviso_agregar").text(mensaje);
        $("#mostrarmodal").modal("toggle")
    });

}


function guardar_correo_nuevo(res,email){
    var user = res.user;
    console.log(user.uid);
    return firebase.firestore().collection('teachers').doc(user.uid).get().then(el=>{
        var inf=el.data(); 
        console.log('Entro al documento');
        console.log(inf);
        if (inf=null  || inf==undefined){
            console.log('No existe el registro');
            return firebase.firestore().collection('teachers').doc(user.uid).set({
                nombre:'',
                email:email,
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
}