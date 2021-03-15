
var liga_foto= "";
var liga_video="";
var clave_materia="";
var nombre_materia="";
var UrlImagen;
var existe=0;
var objFoto;



$(document).ready(function(){
    inicializar_pagina();
});  

async  function inicializar_pagina (){
    
}
  

$("#enviar").on('click', function(evt){
    evt.preventDefault();
    salvar_datos();
});


$("#regresar").on('click', function (evt) {
    evt.preventDefault();
    
    window.history.back();
    //window.location.href = "preguntas_listado_por_temas.html"; 
});


async function salvar_datos(){
    
    nombre_materia=($("#nombre").val()).trim();
    clave_materia=($("#clave").val()).trim();
    UrlImagen=($("#UrlFoto").val()).trim();
    objFoto=$("#UrlFoto");
    
    

    validacion_datos=validar_campos(nombre_materia,clave_materia,UrlImagen);

   
    
    if (validacion_datos==1){
        mensaje_error='Todos los campos deben ser llenados y el formato de la imagen debe ser de tipo imagen.'; 
       alert(mensaje_error);
    } else {
        
        await validar_existe_materia();
        //alert("existe " + existe)
        if (existe==0){
            $("#bloque_pregunta").empty()
            $("#bloque_pregunta").append("<center><br><font class='text-danger'>Por favor espere, estamos procesando su petición.</font><br><br></center>")
            console.log("Error="+validacion_datos+ " nombre="+nombre_materia+" clave="+clave_materia+"Imagen="+UrlImagen)
            await salvar_registro_sin_fotos();
            //await salvar_foto_apoyo(); 
        } else {
            alert("Ya existe una materia con la clave: " + clave_materia+" Por favor ingrese otro valor.")
            
        }       
    }
    
}

async  function salvar_foto_apoyo (){
    
   //var objFoto=$("#UrlFoto");
  
   var foto=objFoto.val();
   console.log($("#UrlFoto").val())
   // alert("Entro a salvar foto " + foto)
    if (foto!=null && foto!=""){
        var nombre_archivo=objFoto.prop('files')[0].name;
        var archivo=objFoto.prop('files')[0];
        var refImagen= await firebase.storage().ref("imagenes/materias/" + nombre_archivo)  
        await refImagen.put(archivo)
        .then(snapshot=>{
            snapshot.ref.getDownloadURL().then(UrlImagen=>{
                liga_foto=UrlImagen;
                //console.log(liga_foto);
                
                firebase.firestore().collection('lessons').doc(clave_materia)
                .update({
                    imagen: liga_foto,
                }).then(res => {
                    alert("Se agrego correctamente la materia");
                    window.location.href = 'ver_listado_materias.html';
                }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})                
            });
        })
        .then(function(){
            //alert("Se agrego correctamente la materia");
            //history.back(1);
        })
        ;
    } else {
        //alert("No se capturo bien la foto")
    }
}


async function validar_existe_materia(){
    existe=0;
    await firebase.firestore().collection('lessons')
    .get()
    .then(res=>{
        res.forEach(doc => {
            //alert("clave: " + clave_materia + " ID: " + doc.id)
            if (clave_materia==doc.id){ existe=1;}  
        }); 
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}

async  function salvar_registro_sin_fotos (){
    
    await firebase.firestore().collection('lessons').doc(clave_materia)
    .set({
          nombre:nombre_materia,
          imagen: '',
    }).then(res=>{
        salvar_foto_apoyo();
        //alert('Se agrego correctamente la pregunta');
       // window.location.href = "agregar_preguntas.html"; 
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})

    
}
  



function validar_campos(nombre,clave,imagen){
    var validar=0;
    
    validar=comprobar_imagen(imagen)
    
    if(nombre.length<=0) { validar=1; } 
    if(clave.length<=0) { validar=1; }
    if(imagen.length<=0) { validar=1; }
    

    return validar;
}
  


function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}

function comprobar_imagen(imagen){
    var validar=0
    if(imagen.indexOf(".gif") > -1){resultado1=1} else {resultado1=0}
    if(imagen.indexOf(".jpg") > -1){resultado2=1} else {resultado2=0}
    if(imagen.indexOf(".jpeg") > -1){resultado3=1} else {resultado3=0}
    if(imagen.indexOf(".png") > -1){resultado4=1} else {resultado4=0}

    if((resultado1+resultado2+resultado3+resultado4)>0){validar=0} else {validar=1}
    return validar
}

