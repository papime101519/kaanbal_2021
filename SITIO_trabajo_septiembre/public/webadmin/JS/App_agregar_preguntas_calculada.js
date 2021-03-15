var materia_seleccionada=0;
var tema_seleccionado=0;
var liga_foto= "";
var liga_video="";
var tipo_pregunta="1";
var id_pregunta="";

$(document).ready(function(){
    inicializar_pagina();
});  

async  function inicializar_pagina (){
    await combo_materias();
    materia_seleccionada=$("#materias").val();
    $("#materias").change();
    
}


function actualizar_datos_ventana_modal(){
    $("#aviso_salvar").empty();
        $("#aviso_salvar").append("La pregunta fue agregada correctamente.");
        $("#cerrar_ventana").show();
}
  
$("#materias").change(function(){
    materia_seleccionada=$("#materias").val();   
    combo_temas(materia_seleccionada);
});  

$("#temas").change(function(){
    materia_seleccionada=$("#materias").val();
    tema_seleccionado=$("#temas").val();   
});


$("#enviar").on('click', function(evt){
    evt.preventDefault();
    salvar_datos();
});


$("#cerrar_ventana").on('click', function(evt){
    evt.preventDefault();
    window.history.back();
});


$("#regresar").on('click', function (evt) {
    evt.preventDefault();
    window.history.back();
    //window.location.href = "preguntas_listado_por_temas.html"; 
});


async function salvar_datos(){
    
    var descripcion=($("#descripcion").val()).trim();
    var sugerencias=($("#sugerencias").val()).trim();
    var respuesta=($("#respuesta").val()).trim();
    var tolerancia=($("#tolerancia").val()).trim();


    validacion_datos=validar_campos(descripcion,sugerencias,respuesta,tolerancia);

    if (validacion_datos==1){
        mensaje_error='Los datos no fueron agregados correctamente. Recuerde no dejar campos vacios y que la tolerancia debe tener un valor inferior a la respuesta'; 
        alert(mensaje_error);
    } else {
        $("#ventana_agregar_Pregunta").show();
        $("#cerrar_ventana").hide();
        await salvar_registro_con_fotos(descripcion,sugerencias,respuesta,tolerancia);
        await salvar_foto_apoyo();
        await salvar_video_apoyo();
        
    }
}

async  function salvar_foto_apoyo (){
    var objFoto=$("#URLimagen");
    var foto=objFoto.val();
    if (foto!=null && foto!=""){
        var nombre_archivo=objFoto.prop('files')[0].name;
        var archivo=objFoto.prop('files')[0];
        var refImagen= await firebase.storage().ref("imagenes/preguntas/" + id_pregunta + "_IMG_" + nombre_archivo)
      // var refImagen= await firebase.storage().ref("imagenes/preguntas/"+ nombre_archivo)
        
       await refImagen.put(archivo)
        .then(snapshot=>{
            snapshot.ref.getDownloadURL().then(UrlImagen=>{
                liga_foto=UrlImagen;
                console.log(liga_foto);
                
                firebase.firestore().collection('questions').doc(id_pregunta)
                .update({
                    URLimagen: liga_foto,
                }).then(res => {
                }).catch(err => {
                    // error 
                })
                
            });
        });
    }
}


async  function salvar_video_apoyo (){
    var objVideo=$("#URLvideo");
    var Video=objVideo.val();
    if (Video!=null && Video!=""){
        var nombre_archivo_video=objVideo.prop('files')[0].name;
        var archivo_video=objVideo.prop('files')[0];
        var refVideo= await firebase.storage().ref("imagenes/preguntas/" + id_pregunta+ "_VID_" + nombre_archivo_video)
       // var  refVideo=  await firebase.storage().ref("imagenes/preguntas/"  + nombre_archivo_video)
        
        await refVideo.put(archivo_video)
        .then(snapshot=>{
            snapshot.ref.getDownloadURL().then(UrlVideo=>{
                liga_video=UrlVideo;
                console.log(liga_video);
                

                firebase.firestore().collection('questions').doc(id_pregunta)
                .update({
                    URLvideo: liga_video,
                }).then(res => {
                    //alert('Se agrego correctamente la pregunta');
                   // window.location.href = "agregar_preguntas.html";  
                   //setTimeout(actualizar_datos_ventana_modal, 2000)


                }).catch(err => {
                    // error 
                })
                
            });
        });
    }    
}

async  function salvar_registro_con_fotos (descripcion,sugerencias,respuesta,tolerancia){
    console.log('salvar registro');
    console.log('descripcion: '+ descripcion);
    console.log('sugerencias: '+ sugerencias);
    console.log('materia: '+ materia_seleccionada);
    console.log('tema: '+ tema_seleccionado);
    console.log('tipo_pregunta: '+tipo_pregunta);
    console.log('respuesta: '+ respuesta);
    console.log('tolerancia: '+ tolerancia);
    
    await firebase.firestore().collection('questions')
    .add({
          descripcion:descripcion,
          sugerencias:sugerencias,
          id_materia:materia_seleccionada,
          id_tema:tema_seleccionado,
          tipo_pregunta:tipo_pregunta,
          respuesta:respuesta,
          tolerancia:tolerancia,
          URLimagen: '',
          URLvideo: '',

    }).then(res=>{
        console.log('id: '+ res.id);
        id_pregunta=res.id;

        setTimeout(actualizar_datos_ventana_modal, 5000)


        
    }).catch(err=>{
      
      console.log("se presento un error en la consulta")
    })
    
}
  

function validar_campos(descripcion,sugerencias,respuesta,tolerancia){
    var validar=0;
    if(descripcion.length<=0) { validar=1; } 
    if(respuesta.length<=0) { validar=1; }
    if(tolerancia.length<=0) { validar=1; }
    if(tolerancia>=respuesta){ validar=1}
    return validar;
  }
  
function validarEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test( $email );
  }
  