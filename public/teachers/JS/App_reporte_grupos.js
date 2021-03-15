
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
var grupos_nombre_alumno=[];
var calificaciones_por_examen=[];
var grupos_alumnos=[];
var examenes_filtrados=[];
var nombre_alumnos=[];




var id_usuario= getParameterByName('id_usuario');
var id_grupo= getParameterByName('id_grupo');
var id_materia= getParameterByName('id_materia');
var nombre_grupo= getParameterByName('nombre_grupo');

$(document).ready(function () {
    inicializar_pagina();

});

async function inicializar_pagina() {
    
    $("#nombre_materia_actual").hide();
    $("#piechart_3d").show();
    $("#columnchart_values").hide();
    $("#promedio").hide();
    $("#listado_datos").hide();
    $("#listado_cuestionarios").hide();
    

    $("#nombre_materia_actual").empty();
    $("#nombre_materia_actual").append(nombre_grupo);
    $('#avance').empty();
    $('#promedio').empty();
    $('#piechart_3d').empty();
    $('#columnchart_values').empty();
    
    await traer_nombres_alumnos(id_grupo);
    await traer_examenes_totales_por_materia(id_materia);
    await traer_datos_grupo(id_materia,id_usuario,id_grupo);
    await filtrar_examenes(id_materia,id_usuario);
    await estadisticas_generales_grupo();
    await listado_cuestionarios_por_alumno();
    await grafica_histograma_calificaciones();
     
}



async function traer_nombres_alumnos(id_grupo) {

    console.log("------Nombres Alumnos----------")
    await firebase.firestore().collection("students_groups")
    .where("id_grupo","==",id_grupo)
    .get()
    .then(res => {
            var i=0;
            res.forEach(rpta => {
                var fila = rpta.data();
                nombre_alumnos[i]= [rpta.id,fila.nombre_alumno,fila.id_alumno];
                console.log(nombre_alumnos[i])
                i+=1;
            });

        }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}


async function traer_examenes_totales_por_materia(id_materia) {

    console.log("------Examenes totales por materia--------")
    examenes_numero_registros = 0;
    await firebase.firestore().collection("students-exams")
    .where("id_materia", "==", id_materia)
    .get()
    .then(res => {
            $('#listado_cuestionarios').empty();
            var i=0;
            res.forEach(rpta => {
                var fila = rpta.data();
                examenes_totales[i]=[fila.id_usuario,fila.calificacion_final,fila.id_materia,fila.id_tema,fila.id_cuestionario,fila.nombre_cuestionario,fila.fecha]
                console.log(examenes_totales[i])
                i+=1;
            });
        }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}



async function traer_datos_grupo(id_materia,id_profesor,id_grupo) {
    console.log("-------Alumnos del grupo ----------")
    console.log('Materia: ' + id_materia)
    console.log('Profesor: ' + id_profesor)
    console.log('grupo: ' + id_grupo)
    var grupos_numero_registros = 0;
    await firebase.firestore().collection("students_groups")
    .where("id_materia", "==", id_materia)
    .where("id_profesor", "==", id_profesor)
    .where("id_grupo", "==", id_grupo)
        .get()
        .then(res => {
            $('#listado_cuestionarios').empty();
            var i=0;
            res.forEach(rpta => {
                var fila = rpta.data();
                grupos_alumnos[i]=[fila.id_alumno,fila.id_grupo,fila.id_materia,fila.id_profesor,fila.nombre_alumno]
                console.log(grupos_alumnos[i]);
                i+=1;
            });
        }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}

async function filtrar_examenes(id_materia,id_usuario) {
    console.log("-------Filtrar examenes ----------")
    var k=0;      
    var agregar;

    for (i = 0; i < examenes_totales.length; i++) {
        agregar=0;
        for (j = 0; j < grupos_alumnos.length; j++) {
            if(grupos_alumnos[j][0]==examenes_totales[i][0]){
                agregar=1;  
            } 
        }
        if (agregar==1){
            examenes_filtrados[k]=[
                examenes_totales[i][0],
                examenes_totales[i][1],
                examenes_totales[i][2],
                examenes_totales[i][3],
                examenes_totales[i][4],
                examenes_totales[i][5],
                examenes_totales[i][6]];
            console.log(examenes_filtrados[k]);
            k+=1;
        }  
          
    }

    if(examenes_filtrados.length==0){
       // $('#ventana_aviso').show();
    } else {

    }
    
}



async function listado_cuestionarios_por_alumno() {

    console.log("---Listado Alumnos ------")

    $('#listado_cuestionarios').empty();
    var num_registros=0;

    if (examenes_filtrados.length == 0) {
        $('#listado_cuestionarios').append("<br><br><center>No se encontraron registros.</center><br><br>");
        $('#ventana_aviso').show();
    } else {
        $("#nombre_materia_actual").show();
        $("#piechart_3d").show();
        $("#columnchart_values").show();
        $("#promedio").show();
        $("#listado_datos").show();
        $("#listado_cuestionarios").show();
    }

    var k=0;      
    var agregar;
    var calificacion_examen;
    var aprobados;
    var reprobados;
    var suma_calificaciones;
    var registros_por_tema;

    $('#listado_cuestionarios').empty();
     
    for (i = 0; i < nombre_alumnos.length; i++) {
        agregar=0; aprobados=0; reprobados=0; 
        suma_calificaciones=0; registros_por_tema=0;
        calificacion_examen=0; k=0; promedio=0;
        
        for (j = 0; j < examenes_filtrados.length; j++) {
            if(examenes_filtrados[j][0]==nombre_alumnos[i][2]){
                agregar=1; 
                //registros_por_tema+=1;
                calificacion_examen=examenes_filtrados[j][1];
                //alert("E: " + calificacion_examen)
                //console.log("Calif: " + calificacion_examen)
                if(calificacion_examen>6){aprobados+=1;} else{reprobados+=1;}
                suma_calificaciones=suma_calificaciones+calificacion_examen;
                k+=1;
                promedio=suma_calificaciones/k
            } 
        } 
        //console.log("tema: " + nombre_alumnos[i][1] +  "  A: " + aprobados + "   R: "+ reprobados +" P: " + promedio) 
        $('#listado_cuestionarios').append("<tr><td width='60%'>" + nombre_alumnos[i][1] + "<td><td width='40%'><span class='text-success'>Promedio: </span> " + promedio+" <br><span class='text-success'>Exámenes Aprobados: </span> "+aprobados+" <br><span class='text-success'>Exámenes Reprobados: </span>"+reprobados+"</td></tr>")
     
    }

}




async function grafica_histograma_calificaciones() {
    console.log("-------grafica histograma----");
    var calificacion_examen;
    var bloque_calificaciones=[0,0,0,0,0,0,0,0,0,0];
     
    for (i = 0; i < nombre_alumnos.length; i++) {
        for (j = 0; j < examenes_filtrados.length; j++) {
            if(examenes_filtrados[j][0]==nombre_alumnos[i][2]){
                calificacion_examen=examenes_filtrados[j][1];
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
        } 
    }
    console.log(bloque_calificaciones)

   grafica_histograma_examenes(bloque_calificaciones)


}



async function estadisticas_generales_grupo() {
    console.log("-------Estadisticas generales grupo ----------")
    console.log(examenes_filtrados)
    $('#listado_cuestionarios').empty();
    var num_registros=0;
    var calificacion_promedio=0;
    var calificacion_maxima=0;
    var calificacion_minima=0;
    var suma_calificaciones=0;
    var cuestionarios_aprobados=0;
    var cuestionarios_reprobados=0;

    for (i = 0; i < examenes_filtrados.length; i++) {
        num_registros += 1;
        var calificacion_examen = examenes_filtrados[i][1];
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
        $('#promedio').append("<center><kbd  class='text-ligth bg-primary font-weight-bolder  '>INTENTOS REALIZADOS: " + num_registros + " /  PROMEDIO: " + calificacion_promedio + " / CALF. MAX: " + calificacion_maxima + " / CALF. MIN: " + calificacion_minima + "</kbd></center>");
    }
    
    // alert("A: " + cuestionarios_aprobados+ " R: " +cuestionarios_reprobados)
    
   drawChart(cuestionarios_aprobados, cuestionarios_reprobados)
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
    window.location.href = "avances_grupo.html"; 
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}


