var materia_seleccionada=-5;

$(document).ready(function(){
    $("#bloque_materias").hide();
    $("#bloque_tema").hide();
    //$("#bloque_pregunta").hide();
    combo_materias();
});  

$("#materias").change(function(){
    materia_seleccionada=$("#materias").val();   
    combo_temas(materia_seleccionada);
});  

$("#temas").change(function(){
    materia_seleccionada=$("#materias").val();
    tema_seleccionado=$("#temas").val();   
    //listadoPreguntas(materia_seleccionada,tema_seleccionado);
});


function combo_materias(){
    firebase.firestore().collection('lessons')
      .onSnapshot(res=>{
          llenar_materias(res);
      }); 
  }

  function combo_temas(materia_seleccionada){
    if (materia_seleccionada!=0){    
        firebase.firestore().collection('lessons').doc(materia_seleccionada).get().then(res=>{
            var datos=res.data();
            temas=datos.topic;
            console.log(temas);
            i=0;
            $('#temas').empty();
            temas.forEach(element => {
                if (i==0){ seleccionado='selected'} else {seleccionado=''}
                $('#temas').append("<option value='" +  i   + "' " + seleccionado + " >" +  element  + "</option>");
                i=i+1;
            });
            $("#bloque_tema").show(); 
            $("#temas").change();
            
        }).catch(err=>{
             //console.log('Ocurrio un error');
             $("#bloque_tema").hide();
             //$("#lista_preguntas").hide();
        
        }); 

    } else {
        $("#bloque_tema").hide();
        //$("#lista_preguntas").hide();
    }

}


function llenar_materias(res){
    $('#materias').empty();
    i=0;
	res.forEach(rpta=>{
		var fila= rpta.data();
		var KEY=rpta.id;
        var nombre = fila.nombre;
        if (i==0){ seleccionado='selected'} else {seleccionado=''}
        $('#materias').append("<option value='" +  KEY   + "' " + seleccionado + " >" +  nombre  + "</option>");
        i=i+1;
  });
  $("#bloque_materias").show();
  $('#materias').change();
  
}



function validar_campos(descripcion,sugerencia,opcion1,opcion2,opcion3,opcion4,opcion5,opcion_correcta){
  var validar=0;

  if(descripcion.length<=0) { validar=1; } 
  if(opcion1.length<=0) { validar=1; }
  if(opcion2.length<=0) { validar=1; }
  if(opcion3.length<=0) { validar=1; } 
  if(opcion4.length<=0) { validar=1; }
  if(opcion5.length<=0) { validar=1; }
  if(sugerencia.length<=0) { validar=1; }
  if(opcion_correcta.length<=0) { validar=1; }
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
    var opcion_correcta=($("#opcion_correcta").val()).trim();
    var tipo_pregunta=$("#tipo_pregunta").val();
    var id_materia=$("#materias").val();
    var id_tema=$("#temas").val();

    console.log('materia: ' + id_materia);
    console.log('tema: ' + id_tema);
    validacion_datos=validar_campos(descripcion,sugerencias,opcion1,opcion2,opcion3,opcion4,opcion5,opcion_correcta);
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
              opcion_correcta:opcion_correcta,
              opcion1:opcion1,
              opcion2:opcion2,
              opcion3:opcion3,
              opcion4:opcion4,
              opcion5:opcion5

        }).then(res=>{
            alert('Se agrego correctamente la pregunta');
            window.location.href = "agregar_preguntas.html"; 
        }).catch(err=>{
          // error 
        })
      
  
        ////////////////////////////////////////////////
    }
  
  });
  


  $("#regresar").on('click', function (evt) {
    evt.preventDefault();
    window.history.back();
    //window.location.href = "preguntas_listado_por_temas.html"; 
});