
//var id_usuario="ID";
var nombre_cuestionario = 0;
var calificacion_promedio = 0;

var num_registros = 0;
var calificacion_maxima = 0;
var calificacion_minima = 0;
var cuestionarios_aprobados = 0;
var cuestionarios_reprobados = 0;
var calificaciones_cuestionarios_tema=[];
calificaciones_cuestionarios_tema[0]=["Element", "Calf.", { role: "style" } ];

var examenes_totales=[];
var estadisticas_temas=[];
var estadisticas_materias=[];

var grupos_nombre_alumno=[];
var calificaciones_por_examen=[];
var datos_alumnos=[];

var nombre_alumnos=[];




var id_profesor= getParameterByName('id_usuario');
var id_alumno= getParameterByName('id_alumno');
var id_grupo= getParameterByName('id_grupo');
var id_materia= getParameterByName('id_materia');
var nombre_grupo= getParameterByName('nombre_grupo');
var nombre_alumno= getParameterByName('nombre_alumno');
var nombre_materia="";


$(document).ready(function () {
    inicializar_pagina();

});

async function inicializar_pagina() {
    
    //VERIFICAR DONDE SE PONE QUE SI SON CERO EXAMENES MANDE UN AVISO
    $("#lista_preguntas").hide();
    $("#nombre_materia_actual").hide();


    $("#nombre_materia_actual").empty();
    $("#nombre_materia_actual").append(nombre_alumno);
    $('#avance').empty();
    $('#promedio').empty();
    $('#piechart_3d').empty();
    $('#columnchart_values').empty();
    
    await traer_nombre_materia();
    await traer_examenes_totales_por_alumno();
    await traer_estadisticas_materias();
    await traer_estadisticas_temas();
    await estadisticas_generales_alumno();
    await grafica_histograma_calificaciones();
    await listado_estadisticas_materia();
    
    await listado_estadisticas_temas();   
}


async function traer_nombre_materia() {
    console.log("------Nombre materia--------")
    examenes_numero_registros = 0;
    await firebase.firestore().collection("lessons").doc(id_materia)
    .get()
    .then(res => {
            nombre_materia=res.data().nombre;
            console.log("materia: " + nombre_materia);
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}


async function traer_examenes_totales_por_alumno() {
    console.log("------Examenes totales - Alumno materia--------")
    examenes_numero_registros = 0;
    await firebase.firestore().collection("students-exams")
    .where("id_materia", "==", id_materia)
    .where("id_usuario", "==", id_alumno)
    .get()
    .then(res => {
            var i=0;
            res.forEach(rpta => {
                var fila = rpta.data();
                examenes_totales[i]=[fila.id_usuario,fila.calificacion_final,fila.id_materia,fila.id_tema,fila.id_cuestionario,fila.nombre_cuestionario,fila.fecha]
                console.log(examenes_totales[i])
                i+=1;
                $("#lista_preguntas").show();
                $("#nombre_materia_actual").show();

            });
        }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}




async function traer_estadisticas_materias() {
    console.log("------Estadisticas_materias--------")
    examenes_numero_registros = 0;
    await firebase.firestore().collection("students_lessons")
    .where("id_materia", "==", id_materia)
    .where("id_alumno", "==", id_alumno)
    .get()
    .then(res => {
            var i=0;
            res.forEach(rpta => {
                var fila = rpta.data();
                estadisticas_materias[i]=[
                    fila.id_alumno,
                    fila.id_materia,
                    fila.numero_temas_aprobados,
                    fila.numero_temas_materia,
                    fila.primer_acceso,
                    fila.promedio,
                    fila.ultimo_acceso,
                    fila.fecha_termino,
                    fila.terminado
                ]
                console.log(estadisticas_materias[i])
                i+=1;
            });
        }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}


async function traer_estadisticas_temas() {
    console.log("------Estadisticas temas--------")
    await firebase.firestore().collection("students_topics")
    .where("id_materia", "==", id_materia)
    .where("id_alumno", "==", id_alumno)
    .get()
    .then(res => {
            var i=0;
            res.forEach(rpta => {
                var fila = rpta.data();
                estadisticas_temas[i]=[
                    fila.id_alumno,
                    fila.id_materia,
                    fila.id_tema,
                    fila.nombre_tema,
                    fila.num_cuestionarios_aprobados,
                    fila.num_cuestionarios_tema,
                    fila.posicion_temario,
                    fila.primer_acceso,
                    fila.promedio,
                    fila.ultimo_acceso,
                    fila.fecha_termino
                ]
                console.log(estadisticas_temas[i])
                i+=1;
            });
        }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}



async function estadisticas_generales_alumno() {
    console.log("-------Estadisticas generales alumno ----------")
    console.log(examenes_totales)
    $('#listado_cuestionarios').empty();
    var num_registros=0;
    var calificacion_promedio=0;
    var calificacion_maxima=0;
    var calificacion_minima=0;
    var suma_calificaciones=0;
    var cuestionarios_aprobados=0;
    var cuestionarios_reprobados=0;
    
    for (i = 0; i < examenes_totales.length; i++) {
        num_registros += 1;
        var calificacion_examen = examenes_totales[i][1];
        suma_calificaciones+=calificacion_examen
        calificacion_promedio=suma_calificaciones/(num_registros);
        //calificacion_promedio = (calificacion_promedio * (num_registros-1) + calificacion_examen) / num_registros;
        
        //alert("E: " + calificacion_examen)
        if (calificacion_examen >= calificacion_maxima) { calificacion_maxima = calificacion_examen; }
        if (calificacion_examen <= calificacion_minima) { calificacion_minima = calificacion_examen; }
        if (calificacion_examen >= 6) { cuestionarios_aprobados += 1; } else { cuestionarios_reprobados += 1 }
        //alert(cuestionarios_aprobados, cuestionarios_reprobados)
        //drawChart(cuestionarios_aprobados, cuestionarios_reprobados)
        $('#promedio').empty();
        $('#promedio').append("<center><kbd  class='text-ligth bg-primary font-weight-bolder  '>INTENTOS REALIZADOS: " + num_registros + " /  PROMEDIO EXÁMENES: " + calificacion_promedio + " / CALF. MAX: " + calificacion_maxima + " / CALF. MIN: " + calificacion_minima + "</kbd></center>");
    }
    
    // alert("A: " + cuestionarios_aprobados+ " R: " +cuestionarios_reprobados)
    
   drawChart(cuestionarios_aprobados, cuestionarios_reprobados)
}

async function listado_estadisticas_materia() {
    console.log("---Tabla materias ------")
    $('#avance_materia').empty();
    if (estadisticas_materias.length == 0) {
        $('#avance_materia').append("<br><br><center>No se encontraron registros.</center><br><br>");
        //$("#lista_preguntas").hide();
        //$("#nombre_materia_actual").hide();
        $('#ventana_aviso').show();

    } else {
         $("#lista_preguntas").show();
         $("#nombre_materia_actual").show();
    }



    $('#avance_materia').empty();
     
    for (i = 0; i < estadisticas_materias.length; i++) {
       // console.log("Materia: " + estadisticas_materias[i][1] ) 
         console.log(estadisticas_materias)

        var mensaje="<center><h4>"+nombre_materia+"<h4></center>";
        mensaje+="<br>Promedio actual: "+ estadisticas_materias[0][5];
        if (estadisticas_materias[0][8]==0){
            mensaje+="<br>Estado: Sin completar";
        } else {
            var fecha_termino=cambiar_fecha(estadisticas_materias[0][7])
            mensaje+="<br>Estado: Completada el día: " + fecha_termino;
        }

        var primer_acceso=cambiar_fecha(estadisticas_materias[0][4]);
        var ultimo_acceso=cambiar_fecha(estadisticas_materias[0][6]);
        mensaje+="<br>Temas aprobados ("+ estadisticas_materias[0][2]+") / temas de la materia ("+ estadisticas_materias[0][3]+")";
        mensaje+="<br>Primer Acceso ("+ primer_acceso+") / Último Acceso ("+ ultimo_acceso+")";

        $('#avance_materia').append(mensaje)
    }
}


async function listado_estadisticas_temas() {
    console.log("---Tabla temas ------")
    $('#listado_cuestionarios').empty();
    var mensaje="";
    if (estadisticas_temas.length == 0) {
        $('#listado_cuestionarios').append("<br><br><center>No se encontraron registros.</center><br><br>");
    }
    $('#listado_cuestionarios').empty();
     
    for (i = 0; i < estadisticas_temas.length; i++) {

        var mensaje="<tr><td width='50%'>"+ estadisticas_temas[i][3]+"</td><td width='50%'>";
        mensaje+="<br>Promedio actual: "+ estadisticas_temas[i][8];
        if (estadisticas_temas[i][4]<estadisticas_temas[i][5]){
            mensaje+="<br>Estado: Sin completar";
        } else {
            var fecha_termino = cambiar_fecha(estadisticas_temas[i][10]);
            mensaje+="<br>Estado: Completado el día: " + fecha_termino;
        }
        mensaje+="<br>Cuestionarios aprobados:"+ estadisticas_temas[i][4];
        mensaje+="<br>Cuestionarios del tema:  "+ estadisticas_temas[i][5];
        
        var primer_acceso = cambiar_fecha(estadisticas_temas[i][7]);
        var ultimo_acceso = cambiar_fecha(estadisticas_temas[i][9]);

        mensaje+="<br>Primer Acceso: "+ primer_acceso;
        mensaje+="<br>Último Acceso: "+ ultimo_acceso;
       
        mensaje+="</td></tr>";
        $('#listado_cuestionarios').append(mensaje)

        //$('#listado_cuestionarios').append("<tr><td width='60%'><td><td width='40%'><span class='text-success'>"+i+"</span> </td></tr>")
    }
}



async function grafica_histograma_calificaciones() {
    console.log("-------grafica histograma----");
    var calificacion_examen;
    var bloque_calificaciones=[0,0,0,0,0,0,0,0,0,0];
        for (j = 0; j < examenes_totales.length; j++) {
            calificacion_examen=examenes_totales[j][1];
            if (calificacion_examen>=0 && calificacion_examen<1){ bloque_calificaciones[0] +=1;}
            if (calificacion_examen>=1 && calificacion_examen<2){ bloque_calificaciones[1] +=1;}
            if (calificacion_examen>=2 && calificacion_examen<3){ bloque_calificaciones[2] +=1;}
            if (calificacion_examen>=3 && calificacion_examen<4){ bloque_calificaciones[3] +=1;}
            if (calificacion_examen>=4 && calificacion_examen<5){ bloque_calificaciones[4] +=1;}
            if (calificacion_examen>=5 && calificacion_examen<6){ bloque_calificaciones[5] +=1;}
            if (calificacion_examen>=6 && calificacion_examen<7){ bloque_calificaciones[6] +=1;}
            if (calificacion_examen>=7 && calificacion_examen<8){ bloque_calificaciones[7] +=1;}
            if (calificacion_examen>=8 && calificacion_examen<9){ bloque_calificaciones[8] +=1;}
            if (calificacion_examen>=9 && calificacion_examen<=10){ bloque_calificaciones[9] +=1;} 
        } 
    
    console.log(bloque_calificaciones)

   grafica_histograma_examenes(bloque_calificaciones)


}


google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);
google.charts.setOnLoadCallback(grafica_histograma_examenes);

function drawChart(cuestionarios_aprobados, cuestionarios_reprobados) {

    var data = google.visualization.arrayToDataTable([
        [' ', ' '],
        ['Cuestionarios Aprobados', cuestionarios_aprobados],
        ['Cuestionarios Reprobados', cuestionarios_reprobados],
    ]);

    var options = {
        chartArea: { width: '100%', height: '100%' },
        title: '',
        is3D: true,
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
    chart.draw(data, options);
}





function grafica_histograma_examenes(calificacion_final) {
    if (calificacion_final!=undefined) {

        for (var i = 0; i < calificacion_final.length; i++) {
            var cadena=[ i, calificacion_final[i], "red"];
            calificaciones_cuestionarios_tema.push(cadena);
         }

      console.log(calificaciones_cuestionarios_tema);

      var data = google.visualization.arrayToDataTable(calificaciones_cuestionarios_tema);
      console.log(data)
    } else {
  
    var datos=[
      ["", "Density", { role: "style" } ],
      ["", 0, "white"],
      ]
      var data = google.visualization.arrayToDataTable(datos);
    
  }


    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                     { calc: "stringify",
                       sourceColumn: 1,
                       type: "string",
                       role: "annotation" },
                     2]);

    var options = {
      title: "HISTROGRAMA DE CALIFCACIONES- CUESTIONARIOS MATERIA",
      width: "100%",
      height: "150%",
      bar: {groupWidth: "95%"},
      legend: { position: "none" },
    };
    var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
    chart.draw(view, options);
}




function drawChart2(calificacion_final) {
    if (calificacion_final!=undefined) {
      var cadena=[ "", calificacion_final, "red"];
      calificaciones_cuestionarios_tema.push(cadena);
      console.log(calificaciones_cuestionarios_tema);

      var data = google.visualization.arrayToDataTable(calificaciones_cuestionarios_tema);

    } else {
  

    var datos=[
      ["", "Density", { role: "style" } ],
      ["", 0, "white"],
      ]
      var data = google.visualization.arrayToDataTable(datos);
    
  }

    

    
   // var data = google.visualization.arrayToDataTable(calificaciones_cuestionarios_tema);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                     { calc: "stringify",
                       sourceColumn: 1,
                       type: "string",
                       role: "annotation" },
                     2]);

    var options = {
      title: "Historial de las calificaciones de los cuestionarios",
      width: "100%",
      height: "150%",
      bar: {groupWidth: "95%"},
      legend: { position: "none" },
    };
    var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
    chart.draw(view, options);
}



async function moverse_pagina(){
    //window.location.href = "avances_grupo.html"; 
    history.back(1);
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function cambiar_fecha(fecha){

    var date = new Date(fecha*1000);
    var _mes=date.getMonth()+1; //getMonth devuelve el mes empezando por 0
    var _dia=date.getDate(); //getDate devuelve el dia del mes
    var _anyo=date.getFullYear();

    var  fecha_cambiada=_dia+"-"+_mes+"-"+_anyo
    return fecha_cambiada;

    return
}

function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}


