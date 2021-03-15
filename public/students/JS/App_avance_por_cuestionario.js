var id_pregunta=0;
var materia_seleccionada=0;
var tema_seleccionado=0;
var id_usuario;
var nombre_cuestionario=0;
var calificacion_promedio=0;
var num_registros=0;
var calificacion_maxima=0;

$(document).ready(function(){
    inicializar_pagina();

});  

async  function inicializar_pagina (){
    await combo_materias();
    materia_seleccionada=$("#materias").val();
    $("#materias").change();
    //cuestionarios_contestados(materia_seleccionada);
    
}

$("#materias").change(function(){
    materia_seleccionada=$("#materias").val(); 
    $('#promedio').empty();  
    cuestionarios_contestados(materia_seleccionada);
}); 


async function cuestionarios_contestados(materia_seleccionada){

    var num_registros=0;
    //console.log('materia ' + materia_seleccionada)
    var id_usuario = firebase.auth().currentUser.uid;
    console.log(id_usuario);
    $('#listado_cuestionarios').empty();

    firebase.firestore().collection("students-exams").where("id_materia","==",materia_seleccionada).where("id_usuario","==",id_usuario)
    .get()
    .then(res=>{
        $('#listado_cuestionarios').empty();
        res.forEach(rpta=> {
            num_registros+=1;
            var fila= rpta.data();
            var nombre_cuestionario= fila.nombre_cuestionario;
            var calificacion_final = fila.calificacion_final;
           // obtener_nombre_cuestionario(fila.id_cuestionario,calificacion_final);
            calificacion_promedio=(calificacion_promedio*(num_registros-1)+calificacion_final)/num_registros;
            if (calificacion_final>=calificacion_maxima){ calificacion_maxima=calificacion_final;}
            $('#listado_cuestionarios').append("<tr><td>"+nombre_cuestionario+"</td><td>Calif: " +  calificacion_final  + "</td></tr>"); 
            $('#promedio').empty();
            $('#promedio').append("<kbd  class='text-ligth bg-primary font-weight-bolder  '>INTENTOS REALIZADOS: " + num_registros + " /  PROMEDIO: "+ calificacion_promedio+" / CALF. MAX: " + calificacion_maxima +"</kbd>");

        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    
    
}

$("#eliminar").on('click', function(evt){
    firebase.firestore().collection('exams').doc(id_pregunta).delete().then(res=>{
        location.reload();
    }).catch(err=>{
        // en caso de error
    });
})


$("#enviar").on('click', function(evt){

    evt.preventDefault();
    var descripcion=($("#descripcion").val()).trim();
    var sugerencias=($("#sugerencias").val()).trim();
    var URLimagen=($("#URLimagen").val()).trim();
    var URLvideo=($("#URLvideo").val()).trim();
    var respuesta=($("#respuesta").val()).trim();
    var tipo_pregunta=$("#tipo_pregunta").val();
    var id_materia=$("#materias").val();
    var id_tema=$("#temas").val();

    console.log('materia: ' + id_materia);
    console.log('tema: ' + id_tema);
    validacion_datos=validar_campos(descripcion,sugerencias,respuesta);
    if (validacion_datos==1){
        mensaje_error='Se encontraron campos datos vacios.'; 
        alert(mensaje_error);
    } else {

        /////////////////////////////////////////////////
        firebase.firestore().collection('questions')
        .add({
              descripcion:descripcion,
              sugerencias:sugerencias,
              URLimagen:URLimagen,
              URLvideo:URLvideo,
              id_materia:id_materia,
              id_tema:id_tema,
              tipo_pregunta:tipo_pregunta,
              respuesta:respuesta

        }).then(res=>{
            alert('Se agrego correctamente la pregunta');
            window.location.href = "agregar_preguntas.html"; 
        }).catch(err=>{
          // error 
        })
      
  
        ////////////////////////////////////////////////
    }
  
  });
  

function validar_campos(descripcion,sugerencia,respuesta){
    var validar=0;
  
    if(descripcion.length<=0) { validar=1; } 
    if(respuesta.length<=0) { validar=1; }
    if(sugerencia.length<=0) { validar=1; }
    if(respuesta.length<=0) { validar=1; }
    return validar;
  }
  
  function validarEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test( $email );
  }
  
  