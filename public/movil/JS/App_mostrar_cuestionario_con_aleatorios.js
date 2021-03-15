var id_materia= getParameterByName('id_materia');
var id_tema= getParameterByName('id_tema');
var nombre_tema=getParameterByName('nombre_tema');
var nombre_cuestionario="";
var id_cuestionario=getParameterByName('id_cuestionario');
var id_usuario;
var claves_preguntas;
var registros;
var calificacion_final=0;


$(document).ready(function(){
    inicializar_pagina();
});  

async  function inicializar_pagina (){
    $('#titulo_materia').append(id_materia); 
    $('#titulo_pagina').append(nombre_tema);
    await listadoPreguntas(id_materia,id_tema);

    
}

async function listadoPreguntas(id_materia,id_tema){
    firebase.firestore().collection("exams").doc(id_cuestionario)
    .get()
    .then(function(dato) {
        $('#listado_cuestionarios').empty();
        fila=dato.data();
        nombre_cuestionario=fila.descripcion;
        $('#titulo_pagina').empty();
        $('#titulo_pagina').append("Cuestionario: " +nombre_cuestionario);
        
        registros=1;
        $('#listado_cuestionarios').append("<form id='formulario' name='formulario'>");


        n=(fila.id_preguntas).length;
        //var preguntas_ascendentes=[];
       // for (i=0; i<n; i++) {
        //    preguntas_ascendentes.push(i);
        //}

        var preguntas_ascendentes=fila.id_preguntas;
        var preguntas_ordenadas=[];
        for (i=0; i<n; i++) {
            aleatorio = Math.floor(Math.random()*(preguntas_ascendentes.length));
            preguntas_ordenadas[i] = preguntas_ascendentes[aleatorio];
            preguntas_ascendentes.splice(aleatorio, 1);
        }

        //alert(preguntas_ordenadas)
        

       // var num_pregunta=1;
        console.log(preguntas_ordenadas)
         
        
        for (j=0; j<n; j++) {
            mostrar_preguntas(preguntas_ordenadas[j],(j+1));
        } 
        
        
        
        /*
        var num_pregunta=0;
        fila.id_preguntas.forEach(function(rpta) {
            //var id_pregunta=rpta;
            //mostrar_preguntas(id_pregunta,registros);
            //registros=registros+1;
            mostrar_preguntas(preguntas_ordenadas[num_pregunta],(num_pregunta+1));
            num_pregunta+=1;
        });
        */
        

        $('#listado_cuestionarios').append("</form>");

    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

async function mostrar_preguntas(id_pregunta,num_pregunta){
   await firebase.firestore().collection("questions").doc(id_pregunta)
    .get()
    .then(function(dato) {
        var fila=dato.data();
        var id_pregunta=dato.id;
        var tipo_pregunta=fila.tipo_pregunta;
        
        $('#listado_cuestionarios').append("<input type='hidden' name='id_pregunta_actual[]'  value='"+id_pregunta+"' >");
        $('#listado_cuestionarios').append("<input type='hidden' name='respuestas_correctas[]'  value='"+fila.respuesta+"' >");
        
        $('#listado_cuestionarios').append("<br><br><h3 class='text-danger'>PREGUNTA #"+num_pregunta+" " + id_pregunta + "</h3>");
        $('#listado_cuestionarios').append("<br><span class='text-primary'>Descripcion: </span>"+fila.descripcion);
        if(fila.URLimagen !=""){
            $('#listado_cuestionarios').append("<br><img src='"+fila.URLimagen+"'>");
        }
        if (tipo_pregunta==0){
            $('#listado_cuestionarios').append("<br><br><span class='text-success'>Opcion 1: </span> "+fila.opcion1);
            $('#listado_cuestionarios').append("<br><br><span class='text-success'>Opcion 2: </span> "+fila.opcion2);
            $('#listado_cuestionarios').append("<br><br><span class='text-success'>Opcion 3: </span> "+fila.opcion3);
            $('#listado_cuestionarios').append("<br><br><span class='text-success'>Opcion 4: </span> "+fila.opcion4);
            $('#listado_cuestionarios').append("<br><br><span class='text-success'>Opcion 5: </span> "+fila.opcion5);
        }


        $('#listado_cuestionarios').append("<br><br><span class='text-primary'>Sugerencias: </span>"+fila.sugerencias);
        
        
        if(fila.URLvideo !=""){
            $('#listado_cuestionarios').append("<br><br>Video de apoyo:<br>");
            $('#listado_cuestionarios').append("<video width='200' controls><source src='"+fila.URLvideo+"' type='video/mp4'>Your browser does not support HTML5 video.</video>");
        }

        if (tipo_pregunta==0 ||  tipo_pregunta==1){
            $('#listado_cuestionarios').append("<br><br><label for='respuesta"+ registros+"'><span class='text-primary'>Repuesta:</span> </label>");
            //$('#listado_cuestionarios').append("<input type='text' id='respuesta"+registros+ "' name='respuesta"+registros+"' >");
            $('#listado_cuestionarios').append("<input type='text'  name='respuestas[]' >");
            $('#listado_cuestionarios').append("<hr>");
        }

        if (tipo_pregunta==2){

            $('#listado_cuestionarios').append("<br><br><label for='respuesta"+registros+"'><span class='text-primary'>Repuesta:</span> </label>");
            //$('#listado_cuestionarios').append("<select id='respuesta"+registros+"' name='respuesta"+registros+"'><option value='0' selected>Falso</option><option value='1'>Cierto</option></select>");
            $('#listado_cuestionarios').append("<select  name='respuestas[]'><option value='0' selected>Falso</option><option value='1'>Cierto</option></select>");
            
            $('#listado_cuestionarios').append("<hr>");
        }


    })
    .catch(function(err) {
        //console.log("Error encontrado: ", err);
    });

}


function salvar_datos(){

    
    var capturar_id_preguntas = $("[name='id_pregunta_actual[]']")
    .map(function(){return $(this).val();}).get();
    console.log('id_preguntas: '+ capturar_id_preguntas );


    var capturar_respuestas_correctas = $("[name='respuestas_correctas[]']")
    .map(function(){return $(this).val();}).get();
    console.log('respuestas_correctas: '+ capturar_respuestas_correctas );

    var capturar_respuestas_ingresadas = $("[name='respuestas[]']")
    .map(function(){return $(this).val();}).get();
    console.log('respuestas_ingresadas: '+ capturar_respuestas_ingresadas );

    n=capturar_id_preguntas.length;
    calificacion_final=0;
    var resultado_respuestas=[];

    for (var i=0; i<n; i++) {
        //console.log('clave_pregunta: ' + capturar_id_preguntas[i] + " Respuesta: "+capturar_respuestas[i]);
        if (capturar_respuestas_correctas[i]==capturar_respuestas_ingresadas[i]){
            //console.log("Respuesta #"+i+" Correcta");
            calificacion_final=calificacion_final+1/n
            resultado_respuestas[i]='Correcta';
        } else {
            //console.log("Respuesta #"+i+" Incorrecta");
            resultado_respuestas[i]='Incorrecta';
        }
    }

    calificacion_final=Math.round(calificacion_final*100)/10
    console.log('Calificación final: ' + calificacion_final)

    guardar_registro_cuestionario(resultado_respuestas);


    $('.modal-body').empty();

    for (var i=0; i<n; i++) {
        $('.modal-body').append("<br>Pregunta #"+i+" " + resultado_respuestas[i]);
    }
    $('.modal-body').append("<br><br><h3  class='text-danger'>Calificación final: "+calificacion_final +"</h3>");
    $("#exampleModal").modal("show");

    
}  

function terminar_cuestionario(){
    window.location.href = "practica_materias.html";
}



function cerrar_cuestionario(){
    window.location.href = "practica_materias.html";
}


function guardar_registro_cuestionario(respuestas_correctas){
    var id_usuario = firebase.auth().currentUser.uid;
    console.log(respuestas_correctas)
    console.log(calificacion_final)
    console.log(id_cuestionario)
    console.log(id_usuario);
    console.log(id_tema);
    console.log(id_materia);

    var d = new Date();
    var mes = d.getMonth()+1;
    var dia = d.getDate();
    var anio= d.getFullYear();
    var horas=d.getHours();
    var minutos=d.getMinutes();
    var segundos=d.getSeconds();
    //var fecha=dia+"/"+mes+"/"+anio;

   var fecha=  toTimestamp(anio,mes,dia,horas,minutos,segundos);

  
    firebase.firestore().collection('students-exams')
    .add({
        id_usuario: id_usuario,
        id_materia:id_materia,
        id_tema:id_tema,
        id_cuestionario:id_cuestionario,
        nombre_cuestionario:nombre_cuestionario,
        respuestas:respuestas_correctas,
        calificacion_final:calificacion_final,
        fecha:fecha   
    }).then(res=>{
        //correcto 
    }).catch(err=>{
      // error 
    })
    
    
}

function usuario_actual(){
    firebase.auth().onAuthStateChanged(res=>{
        if (res==null){     
        } else {
            id_usuario=res.id
        }
    });
}


function toTimestamp(year,month,day,hour,minute,second){
    var datum = new Date(Date.UTC(year,month-1,day,hour,minute,second));
    return datum.getTime()/1000;
}
