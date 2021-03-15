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
    //listadoPreguntas(materia_seleccionada,tema_seleccionado);
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



function validar_campos(descripcion,repaso,numero_preguntas){
  var validar=0;

  if(descripcion.length<=0) { validar=1; } 
  if(repaso.length<=0) { validar=1; } 
  if(numero_preguntas.length<=0) { validar=1; }
  return validar;
}

function validarEmail($email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailReg.test( $email );
}



$("#regresar").on('click', function (evt) {
    evt.preventDefault();
    window.history.back();
    //window.location.href = "preguntas_listado_por_temas.html"; 
});


$("#enviar").on('click', function(evt){
    evt.preventDefault();
    var arreglo_preguntas=[];
    var descripcion=($("#descripcion").val()).trim();
    var repaso=($("#repaso").val()).trim();
    var id_materia=$("#materias").val();
    var id_tema=$("#temas").val();
    var numero_preguntas=$("#numero_preguntas").val();

    validacion_datos=validar_campos(descripcion,repaso,numero_preguntas);
    if (validacion_datos==1){
        mensaje_error='Se encontraron campos datos vacios.'; 
        alert(mensaje_error);
    } else {
        //////////////////////////////////////////////
        firebase.firestore().collection('questions').where("id_materia","==",id_materia).where("id_tema","==",id_tema).get()
        .then(res => {
               var i=1;
               res.forEach(rpta=>{
                   var fila= rpta.data();
                   var clave=rpta.id;
                   if(i<=numero_preguntas){
                       arreglo_preguntas.push(clave);
                       //console.log(arreglo_preguntas)
                       i=i+1;
                   }
               });

               arreglo_preguntas=arreglo_aleatorio_cortado(arreglo_preguntas,numero_preguntas);

               firebase.firestore().collection('exams')
               .add({
                     descripcion:descripcion,
                     repaso:repaso,
                     id_materia:id_materia,
                     id_tema:id_tema,
                     id_preguntas:arreglo_preguntas
                     
               }).then(res=>{
                   alert('Se creo correctamente el cuestionario');
                   //window.history.back(); 
               }).catch(err=>{
                 // error 
               })
        }).catch(err=>{
            //en caso de error
        }); 
    }
});



function arreglo_aleatorio_cortado(arreglo_datos,numero_registros){
    var arreglo_preguntas=arreglo_datos;
    var Total = arreglo_preguntas.length;
    var arreglo_ordenado=[];
    for (i=0; i<Total; i++) {
        aleatorio = Math.floor(Math.random()*(arreglo_preguntas.length));
        seleccion = arreglo_preguntas[aleatorio];
        arreglo_ordenado.push(seleccion)
        //console.log(seleccion);
        arreglo_preguntas.splice(aleatorio, 1);
       // console.log(arreglo_preguntas)
    }
    
    //console.log(arreglo_ordenado);
    arreglo_preguntas=arreglo_ordenado.splice(0,numero_registros);
    //console.log(arreglo_preguntas)
    return arreglo_preguntas;
}