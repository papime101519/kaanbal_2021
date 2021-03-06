
var id_materia= getParameterByName('id_materia');
var id_tema= getParameterByName('id_tema');
var nombre_tema=getParameterByName('nombre_tema');
var id_cuestionario=getParameterByName('id_cuestionario');

var nombre_cuestionario="";
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


function terminar_cuestionario(){
    window.history.back();
}

function cerrar_cuestionario(){
    window.history.back();
}


async function listadoPreguntas(id_materia,id_tema){
    // Consulta para traer las preguntas asociadas a un examen
    firebase.firestore().collection("exams").doc(id_cuestionario)
    .get()
    .then(function(dato) {
        $('#listado_cuestionarios').empty();
        fila=dato.data();
        nombre_cuestionario=fila.descripcion;
        $('#titulo_pagina').empty();
        $('#titulo_pagina').append("Cuestionario: " +nombre_cuestionario);

        registros=1;
        // Para cada pregunta se muestran sus elementos
        $('#listado_cuestionarios').append("<form id='formulario' name='formulario'>");
        fila.id_preguntas.forEach(function(rpta) {
            var id_pregunta=rpta;
            mostrar_preguntas(id_pregunta,registros);
            registros=registros+1;
        });
        $('#listado_cuestionarios').append("</form>");

    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}

async function mostrar_preguntas(id_pregunta,registros){
    // se Agrega en formato HTML cada pregunta con base en su tipo
    firebase.firestore().collection("questions").doc(id_pregunta)
    .get()
    .then(function(dato) {
        fila=dato.data();
        var id_pregunta=dato.id;
        var tipo_pregunta=fila.tipo_pregunta;

        // Se almacenan identificados ocultos de cada pregunta
        $('#listado_cuestionarios').append("<input type='hidden' name='id_pregunta_actual[]'  value='"+id_pregunta+"' >");
        $('#listado_cuestionarios').append("<input type='hidden' name='respuestas_correctas[]'  value='"+fila.respuesta+"' >");
        $('#listado_cuestionarios').append("<input type='hidden' name='tolerancias[]'  value='"+fila.tolerancia+"' >");
        $('#listado_cuestionarios').append("<input type='hidden' name='tipo_pregunta[]'  value='"+fila.tipo_pregunta+"' >");
       

        //Se ingresa el n??mero de pregunta y la descripci??n de la misma
        $('#listado_cuestionarios').append("<hr>");
        $('#listado_cuestionarios').append("<br><br><h3 class='text-danger'>PREGUNTA #"+registros+" </h3>");
        $('#listado_cuestionarios').append("<br><span class='text-primary'>Descripcion: </span>"+fila.descripcion);
        
        if(fila.URLimagen !=""){
            //En caso de que exista una imagen almacenada, crea su acceso
            $('#listado_cuestionarios').append("<br><img src='"+fila.URLimagen+"'>");
        }
        if (tipo_pregunta==0){
            //Preguntas opcion multiple
            $('#listado_cuestionarios').append("<div class='form-check'>"); 
            $('#listado_cuestionarios').append(" <input class='form-check-input' type='radio' name='respuestas[]' id='R1"+registros+"' value='1'  >"); 
            $('#listado_cuestionarios').append(" <label class='form-check-label' for='R1"+registros+"''>A) "+fila.opcion1+"</label>"); 
            $('#listado_cuestionarios').append("</div>"); 

            $('#listado_cuestionarios').append("<div class='form-check'>"); 
            $('#listado_cuestionarios').append("<input class='form-check-input' type='radio' name='respuestas[]' id='R2"+registros+"' value='2'  >"); 
            $('#listado_cuestionarios').append("<label class='form-check-label' for='R2"+registros+"''>B) "+fila.opcion2+"</label>"); 
            $('#listado_cuestionarios').append("</div>");

            $('#listado_cuestionarios').append("<div class='form-check'>"); 
            $('#listado_cuestionarios').append("<input class='form-check-input' type='radio' name='respuestas[]' id='R3"+registros+"' value='3'  >"); 
            $('#listado_cuestionarios').append("<label class='form-check-label' for='R3"+registros+"''>C) "+fila.opcion3+"</label>"); 
            $('#listado_cuestionarios').append("</div>"); 

            if(fila.opcion4!=""){  
            $('#listado_cuestionarios').append("<div class='form-check'>"); 
            $('#listado_cuestionarios').append("<input class='form-check-input' type='radio' name='respuestas[]' id='R4"+registros+"' value='4'  >"); 
            $('#listado_cuestionarios').append("<label class='form-check-label' for='R4"+registros+"''>D) "+fila.opcion4+"</label>"); 
            $('#listado_cuestionarios').append("</div>"); 
            }
            if(fila.opcion4!=""){  
            $('#listado_cuestionarios').append("<div class='form-check'>"); 
            $('#listado_cuestionarios').append("<input class='form-check-input' type='radio' name='respuestas[]' id='R5"+registros+"' value='5'  >"); 
            $('#listado_cuestionarios').append("<label class='form-check-label' for='R5"+registros+"''>E) "+fila.opcion5+"</label>"); 
            $('#listado_cuestionarios').append("</div>");
            } 
           
        
        }

        // Se presentan las sugercias realizadas por los profesores 
        $('#listado_cuestionarios').append("<br><br><span class='text-primary'>Sugerencias: </span>"+fila.sugerencias);
        
        
        if(fila.URLvideo !=""){
            //En caso de que exista una video almacenado, crea su acceso
            $('#listado_cuestionarios').append("<br><br>Video de apoyo:<br>");
            $('#listado_cuestionarios').append("<video width='200' controls><source src='"+fila.URLvideo+"' type='video/mp4'>Your browser does not support HTML5 video.</video>");
        }

        //if (tipo_pregunta==0 ||  tipo_pregunta==1){
            if (tipo_pregunta==1){
            // En caso de que la pregunta no sea verdadero o falo, se presenta un campo de texto para ingresar la respuesta
            $('#listado_cuestionarios').append("<br><br><label for='respuesta"+ registros+"'><span class='text-primary'>Repuesta:</span> </label>");
            $('#listado_cuestionarios').append("<input type='text'  name='respuestas[]' >");
            //$('#listado_cuestionarios').append("<hr>");
        }

        if (tipo_pregunta==2){
            // en caso de que la pregunta sea verdadero o falso se presenta un combo para ingresar la respuesta
            $('#listado_cuestionarios').append("<br><br><label for='respuesta"+registros+"'><span class='text-primary'>Repuesta:</span> </label>");
            $('#listado_cuestionarios').append("<select  name='respuestas[]'><option value='0' selected>Falso</option><option value='1'>Cierto</option></select>");
            //$('#listado_cuestionarios').append("<hr>");
        }


    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})

}


function salvar_datos(){

    
    var capturar_id_preguntas = $("[name='id_pregunta_actual[]']")
    .map(function(){return $(this).val();}).get();
    

    var capturar_respuestas_correctas = $("[name='respuestas_correctas[]']")
    .map(function(){return $(this).val();}).get();


    var capturar_tolerancias = $("[name='tolerancias[]']")
    .map(function(){return $(this).val();}).get();

    var capturar_tipo_preguntas = $("[name='tipo_preguntas[]']")
    .map(function(){return $(this).val();}).get();

   
    var capturar_respuestas_ingresadas = $("[name='respuestas[]']")
    .map(function(){return $(this).val();}).get();
   
    n=capturar_id_preguntas.length;

    console.log("respuestas: " + capturar_respuestas_ingresadas.length)
    console.log("id_preguntas: " + n)
    calificacion_final=0;
    var resultado_respuestas=[];

    
    for (var i=0; i<n; i++) {
        rangoInferior=parseFloat(capturar_respuestas_correctas[i])-parseFloat(capturar_tolerancias[i]);
        rangoSuperior=parseFloat(capturar_respuestas_correctas[i])+parseFloat(capturar_tolerancias[i]);
        respuestaIngresada= capturar_respuestas_ingresadas[i];
        if (respuestaIngresada.length=0){ respuestaIngresada=0; }

        console.log("XXXXXXXXXXXXXXX");
        console.log("dato: " + i)
        console.log("Tolerancia: " + capturar_tolerancias[i] );
        console.log("RangoI: " + rangoInferior);
        console.log("RangoS: " + rangoSuperior);
        console.log("Ingreso: " + respuestaIngresada);
        console.log("Rreal: " + capturar_respuestas_correctas[i]);

        if (respuestaIngresada>=rangoInferior  && respuestaIngresada<=rangoSuperior){
       
            calificacion_final=calificacion_final+1/n
            resultado_respuestas[i]='Correcta';
        } else {
            resultado_respuestas[i]='Incorrecta';
        }
    }

    calificacion_final=Math.round(calificacion_final*100)/10
   
    guardar_registro_cuestionario(resultado_respuestas);


    $('.modal-body').empty();

    for (var i=0; i<n; i++) {
        $('.modal-body').append("<br>Pregunta #"+i+" " + resultado_respuestas[i]);
    }
    $('.modal-body').append("<br><br><h3  class='text-danger'>Calificaci??n final: "+calificacion_final +"</h3>");
    $("#exampleModal").modal("show");

    
}  


function guardar_registro_cuestionario(respuestas_correctas){
    var id_usuario = firebase.auth().currentUser.uid;
    var fecha=fecha_actual();
  
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
        actualizar_registros();
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})  
}

async function actualizar_registros(){
    var id_usuario = firebase.auth().currentUser.uid;
    await traer_datos_cuestionarios(id_usuario);
    await actualizar_temas(id_usuario,id_materia,id_tema);
    await actualizar_materias(id_usuario,id_materia);


}

async function traer_datos_cuestionarios(id_usuario){
    var id_usuarios=[];
    var id_materias=[];
    var id_temas=[];
    var id_cuestionarios=[];
    var calificaciones_cuestionarios=[];
   
    await firebase.firestore().collection("students-exams").where("id_usuario", "==", id_usuario)
    .get()
    .then(function(res) {
        res.forEach(function(doc) {
            elemento=doc.data();
            id_temas.push(elemento.id_tema);  
            calificaciones_cuestionarios.push(elemento.calificacion_final)
            id_cuestionarios.push(elemento.id_cuestionario)
            id_materias.push(elemento.id_materia)
            id_usuarios.push(elemento.id_usuario)
        });
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})

    await actualizar_cuestionarios(id_usuarios,id_materias,id_temas,id_cuestionarios,calificaciones_cuestionarios);

}
async function  actualizar_cuestionarios(id_usuarios,id_materias,id_temas,id_cuestionarios,calificaciones_cuestionarios){
    var id_cuestionarios_unicos=[];
    var contador_aprobados;
    var contador_reprobados;
    var valor_promedio;
    var valor_maximo;
    var clave_materia;  
    var clave_tema; 
    var clave_alumno; 
    var clave_cuestionario;

    n=id_cuestionarios.length;
    for (var i = 0; i < n; i++) {
        var existe_cuestionario = id_cuestionarios_unicos.findIndex(cuestionario => cuestionario === id_cuestionarios[i]);
        if (existe_cuestionario==-1){
            id_cuestionarios_unicos.push(id_cuestionarios[i]) 
        }
    }
    
    m=id_cuestionarios_unicos.length;
    var  i=0;
    while (i<m){
        var contador=0;  var contador_aprobados=0;  var contador_reprobados=0;
        var maximo=0;
        var suma=0;
        var j=0;  
        while  (j<n){
            if (id_cuestionarios_unicos[i]==id_cuestionarios[j]){
                clave_tema=id_temas[j];
                clave_materia=id_materias[j];
                clave_alumno=id_usuarios[j];
                clave_cuestionario=id_cuestionarios[j];
                if(calificaciones_cuestionarios[j]>=maximo){ maximo=calificaciones_cuestionarios[j];}
                if(calificaciones_cuestionarios[j]>=6){ contador_aprobados+=1;} else {contador_reprobados+=1;}
                suma=suma+calificaciones_cuestionarios[j];
                contador+=1;
            }
            j+=1;
        }
        valor_promedio=suma/contador;
        valor_maximo=maximo;
 
       // var buscar_registro_cuestionario_query = await firebase.firestore().collection('topics_exams')
       var buscar_registro_cuestionario_query =  firebase.firestore().collection('topics_exams')
        
       .where('id_alumno','==',clave_alumno)
        .where('id_tema','==',clave_tema)
        .where('id_materia','==',clave_materia)
        .where('id_cuestionario','==',clave_cuestionario);
        await buscar_registro_cuestionario_query.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
            
        }).catch(function(err){ mostrar_mensaje_error(err.code,err.message);});

        await firebase.firestore().collection('topics_exams')
        .add({
            id_alumno:clave_alumno,
            id_materia: clave_materia,
            id_tema: clave_tema,
            id_cuestionario: clave_cuestionario,
            calificacion_maxima:valor_maximo,
            promedio:valor_promedio,
            cuestionarios_aprobados:contador_aprobados,
            cuestionarios_reprobados:contador_reprobados

        }).then(res=>{

            //alert('Se agrego correctamente la pregunta '+res.id + "   datos:  ");
            //window.location.href = "agregar_preguntas.html"; 
        }).catch(err=>{mostrar_mensaje_error(err.code,err.message);})

        i+=1;
    }    
}


async function  actualizar_temas(id_usuario,id_materia,id_tema){

    var id_cuestionarios=[];
    var calificaciones_maximas=[];
    var calificaciones_promedio=[];
    var cuestionarios_aprobados=[];
    var cuestionarios_reprobados=[];
    var id_alumno_tema=0;
    var cuestionarios_por_tema=0;
    var terminado=0;
    var fecha_termino="";
    var contador_aprobados=0;
    var contador_reprobados=0;
    var valor_promedio;
    var valor_maximo;

    await firebase.firestore().collection("topics_exams")
    .where("id_alumno", "==", id_usuario)
    .where("id_materia", "==", id_materia)
    .where("id_tema", "==", id_tema)
    .get()
    .then(function(res) {
        res.forEach(function(doc) {
            elemento=doc.data();
            id_cuestionarios.push(elemento.id_cuestionario)
            calificaciones_maximas.push(elemento.calificacion_maxima)
            calificaciones_promedio.push(elemento.promedio)
            cuestionarios_aprobados.push(elemento.cuestionarios_aprobados)
            cuestionarios_reprobados.push(elemento.cuestionarios_reprobados)
        });
    }).then(function(){
        n=id_cuestionarios.length;
        var j=0; 
        var contador=0;
        var maximo=0;
        var suma=0; 
        while  (j<n){
            if(calificaciones_maximas[j]>=6){ contador_aprobados+=1;} else {contador_reprobados+=1;}
            suma=suma+calificaciones_maximas[j];
            contador+=1;  
            j+=1;
        }
        valor_promedio=suma/contador;
        valor_maximo=maximo;

    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);}) 
       
    //alert("A: "+id_usuario +"  T: "+id_tema +"   M: " + id_materia)
    var buscar_registro_tema_query =  firebase.firestore().collection('students_topics')
        .where('id_alumno','==',id_usuario)
        .where('id_tema','==',id_tema)
        .where('id_materia','==',id_materia);
    await buscar_registro_tema_query.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            //alert("doc:" + doc.id)
            id_alumno_tema=doc.id;
            cuestionarios_por_tema=doc.data().num_cuestionarios_tema;
        });      
    }).catch(function(err){mostrar_mensaje_error(err.code,err.message);  });
    
    if(contador_aprobados>=cuestionarios_por_tema){ 
        terminado=1;
        fecha_termino=fecha_actual();
    } else{
        terminado=0;
        fecha_termino="";
    }
    //alert("tema_actualizar: " + id_alumno_tema)
    await firebase.firestore().collection('students_topics').doc(id_alumno_tema)
    .update({
        promedio:valor_promedio,
        terminado:terminado,
        fecha_termino:fecha_termino,
        num_cuestionarios_aprobados:contador_aprobados,
        num_cuestionarios_reprobados:contador_reprobados,
        ultimo_acceso: fecha_actual()

    }).then(res=>{
        //alert('Se actualizo correctamente el tema:  '+id_alumno_tema );
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
        
}


async function  actualizar_materias(id_usuario,id_materia){
    var id_temas=[];
    var calificaciones_maximas=[];
    var calificaciones_promedio=[];
    var temas_aprobados=[];
    var temas_reprobados=[];
    var id_materia_actualizar=0;
    var temas_por_materia=0;
    var terminado=0;
    var fecha_termino="";
    var contador_aprobados=0;
    var contador_reprobados=0;
    var valor_promedio;
    var valor_maximo;

    await firebase.firestore().collection("students_topics")
    .where("id_alumno", "==", id_usuario)
    .where("id_materia", "==", id_materia)
    .get()
    .then(function(res) {
        res.forEach(function(doc) {
            elemento=doc.data();
            id_temas.push(elemento.id_cuestionario)
            calificaciones_maximas.push(elemento.promedio)
            temas_aprobados.push(elemento.temas_aprobados)
            temas_reprobados.push(elemento.temas_reprobados)
        });
    }).then(function(){
        n=id_temas.length;
        var j=0; 
        var contador=0;
        var maximo=0;
        var suma=0; 
        while  (j<n){
            if(calificaciones_maximas[j]>=6){ contador_aprobados+=1;} else {contador_reprobados+=1;}
            suma=suma+calificaciones_maximas[j];
            contador+=1;  
            j+=1;
        }

        valor_promedio=suma/contador;
        valor_maximo=maximo;

    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
           
    var buscar_registro_materia_query = await firebase.firestore().collection('students_lessons')
        .where('id_alumno','==',id_usuario)
        .where('id_materia','==',id_materia);
    await buscar_registro_materia_query.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            id_materia_actualizar=doc.id;
            temas_por_materia=doc.data().num_cuestionarios_tema;
        });      
    }).catch(function(err){mostrar_mensaje_error(err.code,err.message);  });
    
    if(contador_aprobados>=temas_por_materia){ 
        terminado=1;
        fecha_termino=fecha_actual();
    } else{
        terminado=0;
        fecha_termino="";
    }
            
    await firebase.firestore().collection('students_lessons').doc(id_materia_actualizar)
    .update({
        promedio:valor_promedio,
        terminado:terminado,
        fecha_termino:fecha_termino,
        numero_temas_aprobados:contador_aprobados,
        numero_temas_reprobados:contador_reprobados,
        ultimo_acceso: fecha_actual()

    }).then(res=>{
        //alert('Se actualizo correctamente la materia:  '+id_materia_actualizar );
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
        
}


function usuario_actual(){
    firebase.auth().onAuthStateChanged(res=>{
        if (res==null){     
        } else {
            id_usuario=res.id
        }
    });
}

function fecha_actual(){
    var d = new Date();
    var mes = d.getMonth()+1;
    var dia = d.getDate();
    var anio= d.getFullYear();
    var horas=d.getHours();
    var minutos=d.getMinutes();
    var segundos=d.getSeconds();
    return  toTimestamp(anio,mes,dia,horas,minutos,segundos);

}

function toTimestamp(year,month,day,hour,minute,second){
    var datum = new Date(Date.UTC(year,month-1,day,hour,minute,second));
    return datum.getTime()/1000;
}

function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}