var id_pregunta= getParameterByName('id_pregunta');
var materia_seleccionada=0;
var tema_seleccionado=0;



$(document).ready(function () {
    inicializar_pagina();
});

async  function inicializar_pagina (){
    await capturar_registro();
    await combo_materias();
}


$("#materias").change(function () {
    materia_seleccionada = $("#materias").val();
    combo_temas(materia_seleccionada);
});

$("#temas").change(function () {
    materia_seleccionada = $("#materias").val();
    tema_seleccionado = $("#temas").val();
});


$("#cerrar_ventana").on('click', function(evt){
    evt.preventDefault();
    window.history.back();
});



function actualizar_datos_ventana_modal(){
    $("#aviso_salvar").empty();
        $("#aviso_salvar").append("La pregunta fue actualizada correctamente.");
        $("#cerrar_ventana").show();
}
  

async function combo_materias(){
    var consulta= await firebase.firestore().collection('lessons').get()
    .then(res=>{
        $('#materias').empty();
        i=1;
        res.forEach(rpta=>{
            var fila= rpta.data();
            var KEY=rpta.id;
            var nombre = fila.nombre;
            if (KEY == materia_seleccionada) { seleccionado = 'selected' } else { seleccionado = '' }
            $('#materias').append("<option value='" +  KEY   + "' " + seleccionado + " >" +  nombre  + "</option>");
            i=i+1;
        });
        $("#materias").change();
    }).catch(err=>{
        //console.log('Ocurrio un error');
   
   })
       
}




async function combo_temas(materia_seleccionada){  
    var consulta= await firebase.firestore().collection('lessons').doc(materia_seleccionada).collection('Temas').get().then(res=>{
        $('#temas').empty();
        i=0;
        res.forEach(elemento => {
            console.log(i)
            clave=elemento.id;
            nombre=elemento.data().nombre;
            if (clave==tema_seleccionado){ seleccionado='selected'} else {seleccionado=''}
            $('#temas').append("<option value='" +  clave   + "' " + seleccionado + " >" +  nombre  + "</option>");
            i=i+1;
        });
        $("#temas").change();
        
    }).catch(err=>{
         //console.log('Ocurrio un error');
    
    }); 


}



function validar_campos(descripcion, sugerencias, respuesta,tolerancia){
    var validar=0;
    if(descripcion.length<=0) { validar=1; } 
    if(respuesta.length<=0) { validar=1; }
    if(tolerancia.length<=0) { validar=1; }
    if(tolerancia>=respuesta){ validar=1}
    return validar;
  }


$("#enviar").on('click', function (evt) {

    evt.preventDefault();
    var descripcion = ($("#descripcion").val()).trim();
    var sugerencias = ($("#sugerencias").val()).trim();
    var URLimagen = ($("#URLimagen").val()).trim();
    var URLvideo = ($("#URLvideo").val()).trim();
    var respuesta = ($("#respuesta").val()).trim();
    var tolerancia = ($("#tolerancia").val()).trim();
    var tipo_pregunta = $("#tipo_pregunta").val();
    var id_materia = $("#materias").val();
    var id_tema = $("#temas").val();

    //console.log('materia: ' + id_materia);
    //console.log('tema: ' + id_tema);
    validacion_datos = validar_campos(descripcion, sugerencias, respuesta,tolerancia);
    if (validacion_datos == 1) {
        mensaje_error='Los datos no fueron agregados correctamente. Recuerde no dejar campos vacios y que la tolerancia debe tener un valor inferior a la respuesta'; 
        alert(mensaje_error);
    } else {

        $("#ventana_agregar_Pregunta").show();
        $("#cerrar_ventana").hide();

        /////////////////////////////////////////////////
        firebase.firestore().collection('questions').doc(id_pregunta)
            .update({
                descripcion: descripcion,
                sugerencias: sugerencias,
                URLimagen: URLimagen,
                URLvideo: URLvideo,
                id_materia: id_materia,
                id_tema: id_tema,
                tipo_pregunta: tipo_pregunta,
                respuesta: respuesta,
                tolerancia:tolerancia

            }).then(res => {
                /*
                alert('Se modifico correctamente la pregunta');
                var liga='modificar_preguntas_calculada.html?id_pregunta='+id_pregunta;
                //window.location.href = liga;
                window.history.back();*/
                actualizar_datos_ventana_modal();

            }).catch(err => {
                // error 
            })
        ////////////////////////////////////////////////
    }

});



$("#regresar").on('click', function (evt) {
    evt.preventDefault();
    window.history.back();
    //window.location.href = "menu_inicial.html"; 
});

function capturar_registro() {
    firebase.firestore().collection('questions').doc(id_pregunta).get()
        .then(res => {
            fila = res.data();
            materia_seleccionada = fila.id_materia;
            tema_seleccionado = fila.id_tema;
            $('#descripcion').val(fila.descripcion);
            $('#sugerencias').val(fila.sugerencias);
            $('#URLimagen').val(fila.URLimagen);
            $('#URLvideo').val(fila.URLvideo);
            $('#respuesta').val(fila.respuesta);
            $('#tolerancia').val(fila.tolerancia);

        }).catch(err => {

        });

};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}