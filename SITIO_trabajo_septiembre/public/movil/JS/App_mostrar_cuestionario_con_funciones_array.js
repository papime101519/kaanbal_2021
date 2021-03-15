
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
        fila.id_preguntas.forEach(function(rpta) {
            var id_pregunta=rpta;
            console.log(id_pregunta);
            mostrar_preguntas(id_pregunta,registros);
            registros=registros+1;
            //$('#listado_cuestionarios').append("<br>"+id_pregunta);

        });
        $('#listado_cuestionarios').append("</form>");

    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

async function mostrar_preguntas(id_pregunta,registros){
    firebase.firestore().collection("questions").doc(id_pregunta)
    .get()
    .then(function(dato) {
        fila=dato.data();
        var id_pregunta=dato.id;
        var tipo_pregunta=fila.tipo_pregunta;

        $('#listado_cuestionarios').append("<input type='hidden' name='id_pregunta_actual[]'  value='"+id_pregunta+"' >");
        $('#listado_cuestionarios').append("<input type='hidden' name='respuestas_correctas[]'  value='"+fila.respuesta+"' >");
        
        $('#listado_cuestionarios').append("<br><br><h3 class='text-danger'>PREGUNTA #"+registros+" </h3>");
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
    .catch(function(error) {
        console.log("Error getting documents: ", error);
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
        actualizar_temas();
       // actualizar_materias();
        //correcto 
    }).catch(err=>{
      // error 
    })  
}

async function actualizar_temas(){
    var id_temas=[];
    var calificaciones_cuestionarios=[];
    var repetidos=[];
    var promedios=[];
    var id_usuario = firebase.auth().currentUser.uid;
    db=firebase.firestore();
    db.collection("students-exams").where("id_usuario", "==", id_usuario)
    .get()
    .then(function(res) {
        res.forEach(function(doc) {
            elemento=doc.data();
            id_temas.push(elemento.id_tema);
            calificaciones_cuestionarios.push(elemento.calificacion_final)
        });

        n=id_temas.length
        for (var i = 0; i < n; i++) {
            const buscado = repetidos.findIndex(tema => tema === id_temas[i]);
            if (buscado==-1){
                repetidos.push(id_temas[i])
            }
        }
        
        var promedios_maximos=[]
        m=repetidos.length;
        for (var i = 0; i < m; i++) {
            var contador=0;
            var maximo=0
            for (var j = 0; j < n; j++) {
                if (repetidos[i]==id_temas[j]){
                    if(calificaciones_cuestionarios[j]>=maximo){ maximo=calificaciones_cuestionarios[j];}
                    contador+=1;
                }
            }
          // alert("Maximo " + maximo + " elementos: " + contador);
           promedios_maximos[i]=maximo;
        }  
        //alert(promedios_maximos)
        guardar_promedios_temas(id_usuario,repetidos,promedios_maximos);

    })
    .catch(function(error) {
       // console.log("Error getting documents: ", error);
    });
}

async function guardar_promedios_temas(id_usuario,repetidos,promedios_maximos){
    
    n=repetidos.length;

    //var resultados = promedios_maximos.map(function (x) { 
    //    return parseInt(x, 10); 
    //  });
    

    for (var i = 0; i < n; i++) {
        
       // alert("alumno: " + id_usuario+ " id_tema " + repetidos[i] + " promedio " + promedios_maximos[i])
       
        promedios_maximos = promedios_maximos.map(Number);
        var guardar_promedio=promedios_maximos[i]

        //var guardar_promedio=promedios_maximos.shift();
        //alert("elemento " + guardar_promedio + "Array sobrante" + promedios_maximos)
        

        var tema_modificar=repetidos[i];
        alert("valor de i: " + i)
        //var guardar_promedio=promedios_maximos[i]

        var actualizar_query = await firebase.firestore().collection('students_topics')
        .where('id_alumno','==',id_usuario)
        .where('id_tema','==',tema_modificar);
        actualizar_query.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var id_registro=doc.id;
                alert("id tema: "  + id_registro + " promedio: "  + guardar_promedio + " i: " +i)
                
                firebase.firestore().collection('students_topics').doc(id_registro).update({
                    promedio: guardar_promedio
                })
                .then(res=>{
                    //console.log("entro a modificar valor " +parseInt(promedios_maximos[i]))
                })
                .catch(err=>{ 
                    var errorCode = err.code;
                    var errorMessage = err.message;
                    mensaje='Se presento el siguiente error: ' + errorCode + errorMessage  ;
                    console.log(mensaje)
            
                });
            });
        });


    }
}

async function actualizar_materias(){
    var id_usuario = firebase.auth().currentUser.uid;
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
