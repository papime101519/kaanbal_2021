var id_cuestionario= getParameterByName('id_cuestionario');


$(document).ready(function(){
    capturar_datos_cuestionario(id_cuestionario);
});


function capturar_datos_cuestionario(id_cuestionario){
    firebase.firestore().collection('exams').doc(id_cuestionario).get().then(res=>{
        var datos=res.data();
        $("#descripcion_cuestionario").append(datos.descripcion);
        var datos_preguntas=datos.id_preguntas;
        datos_preguntas.forEach(id_pregunta => {
           //console.log(datos_preguntas);
           firebase.firestore().collection('questions').doc(id_pregunta).get()
           .then(res2 =>{
                  fila=res2.data();
                  descripcion_pregunta=fila.descripcion;
                  repaso=fila.repaso;
                  tipo_pregunta=fila.tipo_pregunta;
                  console.log('AA: '+descripcion_pregunta);
                  $('#datos_preguntas').append("<tr><td>" +  descripcion_pregunta + "</td></tr>"  );
            }).catch(err1=>{ 
                //error
            });    
        });
    }).catch(err2=>{
       //error;
    });
  }
  

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}