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
        $("#aviso_salvar").append("La pregunta fue modificada correctamente.");
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

function validar_campos(descripcion,sugerencia,opcion1,opcion2,opcion3,opcion4,opcion5,respuesta){
  var validar=0;

  if(descripcion.length<=0) { validar=1; } 
  if(opcion1.length<=0) { validar=1; }
  if(opcion2.length<=0) { validar=1; }
  if(opcion3.length<=0) { validar=1; }
  //if(respuesta.length<=0) { validar=1; }
    
  //if (!(respuesta==1 || respuesta==2 || respuesta==3 || respuesta==4 || respuesta==5   ))  { validar=1;  }

  return validar;
}

function validarEmail($email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailReg.test( $email );
}



$("#enviar").on('click', function(evt){

    evt.preventDefault();
    var descripcion=($("#descripcion").val()).trim();
    var sugerencias=($("#sugerencias").val()).trim();
    var URLimagen=($("#URLimagen").val()).trim();
    var URLvideo=($("#URLvideo").val()).trim();
    var opcion1=($("#opcion1").val()).trim();
    var opcion2=($("#opcion2").val()).trim();
    var opcion3=($("#opcion3").val()).trim();
    var opcion4=($("#opcion4").val()).trim();
    var opcion5=($("#opcion5").val()).trim();
    var respuesta=($("#respuesta").val())
    var tipo_pregunta=$("#tipo_pregunta").val();
    var id_materia=$("#materias").val();
    var id_tema=$("#temas").val();

    validacion_datos=validar_campos(descripcion,sugerencias,opcion1,opcion2,opcion3,opcion4,opcion5,respuesta);
    if (validacion_datos==1){
        mensaje_error='Se encontraron campos datos vacios, o la respuesta no es valida (debe ser un valor entre 1 y 5 entero)'; 
        
        alert(mensaje_error);
    } else {


        
        $("#ventana_agregar_Pregunta").show();
        $("#cerrar_ventana").hide();


        /////////////////////////////////////////////////

        console.log('materia: ' + materia_seleccionada)
        console.log('tema: ' + tema_seleccionado)

        firebase.firestore().collection('questions').doc(id_pregunta)
            .update({
              descripcion:descripcion,
              sugerencias:sugerencias,
              URLimagen:URLimagen,
              URLvideo:URLvideo,
              id_materia:id_materia,
              id_tema:id_tema,
              tipo_pregunta:tipo_pregunta,
              respuesta:respuesta,
              opcion1:opcion1,
              opcion2:opcion2,
              opcion3:opcion3,
              opcion4:opcion4,
              opcion5:opcion5

        }).then(res=>{
           /* alert('Se modificó correctamente la pregunta');
            var liga='modificar_preguntas_opcion_multiple.html?id_pregunta='+id_pregunta;
            //window.location.href = liga;
            window.history.back();*/
            
            actualizar_datos_ventana_modal();

        }).catch(err=>{
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
    //console.log('id materia: ' + id_pregunta)
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
            $('#opcion1').val(fila.opcion1);
            $('#opcion2').val(fila.opcion2);
            $('#opcion3').val(fila.opcion3);
            $('#opcion4').val(fila.opcion4);
            $('#opcion5').val(fila.opcion5);

        }).catch(err => {

        });

};


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}