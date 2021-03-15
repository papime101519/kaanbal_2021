var id_pregunta=0;
var tema_seleccionado=0;
var id_materia= getParameterByName('id_materia');
var nombre_materia= getParameterByName('nombre_materia');


$(document).ready(function(){
    inicializar_pagina();
    console.log(id_materia);

});  

async  function inicializar_pagina (){
    $('#nombre_materia').empty();
    $('#nombre_materia').append(nombre_materia);
    await listadoTemas(id_materia);

    
}

async function listadoTemas(id_materia){
    var num_registros=0;
    //console.log('materia ' + id_materia)
    firebase.firestore().collection("lessons").doc(id_materia).collection("Temas")
    .get()
    .then(function(querySnapshot) {
        $('#listado_temas').empty();
        querySnapshot.forEach(function(rpta) {
            num_registros+=1;
            var fila= rpta.data();
            var clave=rpta.id;
            var nombre = fila.nombre;
            console.log(nombre)
           // $('#listado_temas').append("<tr><td>" +  nombre  + "</td><td><button type='button' class='btn btn-dark text-center' data-toggle='modal' data-target='#modificar_preguntas'   onclick='ver_cuestionario(\"" + clave + "\");'>Practicar</button></td></tr>"); 
           $('#listado_temas').append("<tr><td>" +  nombre  + "</td><td><button type='button' class='btn btn-dark text-center' data-toggle='modal' data-target='#modificar_preguntas'   onclick='contestar_cuestionario(\"" + clave + "\",\"" + nombre + "\");'>Entrar</button></td></tr>"); 
        
        });
        if (num_registros!=0){ 
            //$("#lista_preguntas").show();
        } else {
            $('#listado_temas').append("No se encontraron registros");
        }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}


function contestar_cuestionario(clave,nombre){
    var liga='cuestionarios_por_tema.html?id_materia='+id_materia+'&id_tema='+clave+'&nombre_materia='+nombre;
        //console.log(liga);
        window.location.href = liga;
}



function borrar(clave){
    //alert('borrar');
    id_pregunta=clave;

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
  
  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}