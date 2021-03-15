var id_pregunta=0;

var materia_seleccionada=0;
var tema_seleccionado=0;

$(document).ready(function(){
    inicializar_pagina();
});  

async  function inicializar_pagina (){
    await combo_materias();
    materia_seleccionada=$("#materias").val();
    $("#materias").change();
    
}


$("#materias").change(function(){
    materia_seleccionada=$("#materias").val();   
    combo_temas(materia_seleccionada);
}); 



$("#temas").change(function(){
    materia_seleccionada=$("#materias").val();
    tema_seleccionado=$("#temas").val();  
    console.log('materia '+materia_seleccionada+' tema  '+tema_seleccionado) 
    listadoPreguntas(materia_seleccionada,tema_seleccionado);
});



async function combo_materias(){
    var consulta= await firebase.firestore().collection('lessons').get()
    .then(res=>{
        $('#materias').empty();
        i=1;
        res.forEach(rpta=>{
            var fila= rpta.data();
            var KEY=rpta.id;
            var nombre = fila.nombre;
            if (i==1){ seleccionado='selected'} else {seleccionado=''}
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
            if (i==0){ seleccionado='selected'} else {seleccionado=''}
            $('#temas').append("<option value='" +  clave   + "' " + seleccionado + " >" +  nombre  + "</option>");
            i=i+1;
        });
        $("#temas").change();
        
    }).catch(err=>{
         //console.log('Ocurrio un error');
    
    }); 


}


function listadoPreguntas(materia_seleccionada,tema_seleccionado){
    var num_registros=0;

    console.log('materia ' + materia_seleccionada)
    console.log('tema ' + tema_seleccionado)

    firebase.firestore().collection("exams").where("id_materia", "==", materia_seleccionada).where("id_tema","==",tema_seleccionado)
    .get()
    .then(function(querySnapshot) {
        $('#datos_preguntas').empty();
        querySnapshot.forEach(function(rpta) {
            num_registros+=1;
            var fila= rpta.data();
            var clave=rpta.id;
            var descripcion = fila.descripcion;
            console.log(descripcion);
            $('#datos_preguntas').append("<tr><td>" +  descripcion   + "</td><td><button type='button' class='btn btn-dark text-center' data-toggle='modal' data-target='#modificar_preguntas'   onclick='ver_cuestionario(\"" + clave + "\");'>Ver</button></td><td><button type='button' class='btn btn-dark text-center'  data-toggle='modal' data-target='#borrar_preguntas'  onclick='borrar(\"" + clave + "\");'>Borrar</button></td></tr>"); 
        });
        if (num_registros!=0){ 
            $("#lista_preguntas").show();
        } else {
            $('#datos_preguntas').append("No se encontraron registros");
        }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}


function ver_cuestionario(clave){
    var liga='ver_cuestionario.html?id_cuestionario='+clave;
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
  
  