var materia_seleccionada=0;
var tema_seleccionado=0;
var liga_foto= "";
var liga_video="";
var tipo_pregunta="0";
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


$("#regresar").on('click', function (evt) {
    evt.preventDefault();
    window.history.back();
    //window.location.href = "preguntas_listado_por_temas.html"; 
});

$("#cerrar_ventana").on('click', function(evt){
    evt.preventDefault();
    window.history.back();
});


async function salvar_datos(){
    
    var descripcion=($("#descripcion").val()).trim();
    var sugerencias=($("#sugerencias").val()).trim();
    var respuesta=($("#respuesta").val());
    var opcion1=($("#opcion1").val()).trim();
    var opcion2=($("#opcion2").val()).trim();
    var opcion3=($("#opcion3").val()).trim();
    var opcion4=($("#opcion4").val()).trim();
    var opcion5=($("#opcion5").val()).trim();
    
    validacion_datos=validar_campos(descripcion,sugerencias,opcion1,opcion2,opcion3,opcion4,opcion5,respuesta);


    if (validacion_datos==1){
        mensaje_error='Se encontraron campos datos vacios, o la respuesta no es valida (debe ser un valor entre 1 y 5 entero)'; 
        alert(mensaje_error);
    } else {
        $("#ventana_agregar_Pregunta").show();
        $("#cerrar_ventana").hide();
        await salvar_registro_con_fotos (descripcion,sugerencias,respuesta,opcion1,opcion2,opcion3,opcion4,opcion5);
   
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
        var refImagen= firebase.storage().ref("imagenes/preguntas/" + id_pregunta + "_IMG_" + nombre_archivo)
        await refImagen.put(archivo)
        .then(snapshot=>{
            snapshot.ref.getDownloadURL().then(UrlImagen=>{
                liga_foto=UrlImagen;
                console.log(liga_foto);
                
                firebase.firestore().collection('questions').doc(id_pregunta)
                .update({
                    URLimagen: liga_foto,
                }).then(res => {
                }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
                
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
        var refVideo= firebase.storage().ref("imagenes/preguntas/" + id_pregunta+ "_VID_" + nombre_archivo_video)
        await refVideo.put(archivo_video)
        .then(snapshot=>{
            snapshot.ref.getDownloadURL().then(UrlVideo=>{
                liga_video=UrlVideo;
                console.log(liga_video);
                

                firebase.firestore().collection('questions').doc(id_pregunta)
                .update({
                    URLvideo: liga_video,
                }).then(res => {
                    //setTimeout(actualizar_datos_ventana_modal, 2000) 
                }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
                
            });
        });
    }    
}

async  function salvar_registro_con_fotos (descripcion,sugerencias,respuesta,opcion1,opcion2,opcion3,opcion4,opcion5){
   
    console.log('salvar registro');
    console.log('descripcion'+ descripcion);
    console.log('sugerencias:'+ sugerencias);
    console.log('materia:'+ materia_seleccionada);
    console.log('tema:'+ tema_seleccionado);
    console.log('tipo_pregunta:'+tipo_pregunta);
    console.log('respuesta:'+ respuesta)
    
    await firebase.firestore().collection('questions')
    .add({
          descripcion:descripcion,
          sugerencias:sugerencias,
          id_materia:materia_seleccionada,
          id_tema:tema_seleccionado,
          tipo_pregunta:tipo_pregunta,
          respuesta:respuesta,
          opcion1:opcion1,
          opcion2:opcion2,
          opcion3:opcion3,
          opcion4:opcion4,
          opcion5:opcion5,
          URLimagen: '',
          URLvideo: '',
          tolerancia:0

    }).then(res=>{
        console.log('id: '+ res.id);
        id_pregunta=res.id;

        setTimeout(actualizar_datos_ventana_modal, 5000)

    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
    
}
  

function validar_campos(descripcion,sugerencia,opcion1,opcion2,opcion3,opcion4,opcion5,respuesta){
    var validar=0;
  
    if(descripcion.length<=0) { validar=1; } 
    if(opcion1.length<=0) { validar=1; }
    if(opcion2.length<=0) { validar=1; }
    if(opcion3.length<=0) { validar=1; }
    //if(respuesta.length<=0) { validar=1; }
      
   // if (!(respuesta==1 || respuesta==2 || respuesta==3 || respuesta==4 || respuesta==5   ))  { validar=1;  }
  
    return validar;
  }
  

function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}



  