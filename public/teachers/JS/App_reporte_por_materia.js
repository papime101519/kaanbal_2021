
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
var nombre_temas=[];




var id_materia= getParameterByName('id_materia');
var nombre_materia= getParameterByName('nombre_materia');
var id_materia= getParameterByName('id_materia');
var id_usuario= getParameterByName('id_usuario');

$(document).ready(function () {
    inicializar_pagina();

});

async function inicializar_pagina() {

    $("#lista_preguntas").hide();
    $("#nombre_materia_actual").hide();
    
    $("#nombre_materia_actual").empty();
    $("#nombre_materia_actual").append(nombre_materia);
    $('#avance').empty();
    $('#promedio').empty();
    $('#piechart_3d').empty();
    $('#columnchart_values').empty();
    
    await traer_nombres_temas(id_materia);
    await traer_examenes_totales_por_materia(id_materia);
    await traer_grupos_por_materia(id_materia,id_usuario);
    await filtrar_examenes(id_materia,id_usuario);
    await estadisticas_generales_materia();
    await listado_cuestionarios_por_materia();
    await estadisticas_calificaciones_examenes();
    //await avance_por_materia(id_materia,id_usuario);
     
}

async function traer_examenes_totales_por_materia(id_materia) {
    examenes_numero_registros = 0;
    await firebase.firestore().collection("students-exams")
    .where("id_materia", "==", id_materia)
    .orderBy("id_tema",'asc')
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


async function traer_nombres_temas(id_materia) {
    await firebase.firestore().collection("lessons")
    .doc(id_materia)
    .collection("Temas")
    .orderBy("num_tema", "asc")
    .get()
    .then(res => {
            var i=0;
            res.forEach(rpta => {
                var fila = rpta.data();
                nombre_temas[i]= [rpta.id,fila.nombre];
                console.log(nombre_temas[i])
                i+=1;
            });

        }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}


async function traer_grupos_por_materia(id_materia,id_profesor) {
    console.log('Materia: ' + id_materia)
    console.log('Usuario: ' + id_profesor)
    var grupos_numero_registros = 0;
    await firebase.firestore().collection("students_groups")
    .where("id_materia", "==", id_materia)
    .where("id_profesor", "==", id_profesor)
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
        $('#ventana_aviso').show();
    } else {
        $("#lista_preguntas").show();
        $("#nombre_materia_actual").show();
    }
    
}

async function avance_por_materia(id_materia,id_usuario){
        console.log("Avance por materia")
        var registros=0;
        firebase.firestore().collection("students_lessons")
        .where("id_materia", "==", id_materia).where("id_alumno","==",id_usuario)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (rpta) {
                registros = registros + 1;
                var fila = rpta.data();
                var calif_promedio=fila.promedio;
                var temas_aprobados=fila.numero_temas_aprobados;
                var temas_materia=fila.numero_temas_materia;
                var mensaje="<center><h3><kbd class='text-ligth bg-primary font-weight-bolder  ' >AVANCE: "+temas_aprobados+"/"+temas_materia+" temas  -  Calificación: "+calif_promedio+"</kbd></h3></center>";
                console.log(mensaje);
                $("#avance").append(mensaje);
                
            });
        }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}




async function avance_por_materiaXXXXX(id_materia,id_usuario){
    console.log("Avance por materia")
    var registros=0;
    firebase.firestore().collection("students_lessons")
    .where("id_materia", "==", id_materia).where("id_alumno","==",id_usuario)
    .get()
    .then(function (querySnapshot) {
        querySnapshot.forEach(function (rpta) {
            registros = registros + 1;
            var fila = rpta.data();
            var calif_promedio=fila.promedio;
            var temas_aprobados=fila.numero_temas_aprobados;
            var temas_materia=fila.numero_temas_materia;
            var mensaje="<center><h3><kbd class='text-ligth bg-primary font-weight-bolder  ' >AVANCE: "+temas_aprobados+"/"+temas_materia+" temas  -  CALIFICACION: "+calif_promedio+"</kbd></h3></center>";
            console.log(mensaje);
            $("#avance").append(mensaje);
            
        });
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}



async function listado_cuestionarios_por_materia() {
    $('#listado_cuestionarios').empty();
    var num_registros=0;

    if (examenes_filtrados.length == 0) {
        $('#listado_cuestionarios').append("<br><br><center>No se encontraron registros.</center><br><br>");
    }

    var k=0;      
    var agregar;
    var calificacion_examen;
    var aprobados;
    var reprobados;
    var suma_calificaciones;
    var registros_por_tema;

    $('#listado_cuestionarios').empty();
     
    for (i = 0; i < nombre_temas.length; i++) {
        agregar=0; aprobados=0; reprobados=0; 
        suma_calificaciones=0; registros_por_tema=0;
        calificacion_examen=0; k=0; promedio=0;
        
        for (j = 0; j < examenes_filtrados.length; j++) {
            if(examenes_filtrados[j][3]==nombre_temas[i][0]){
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
        //console.log("tema: " + nombre_temas[i][1] +  "  A: " + aprobados + "   R: "+ reprobados +" P: " + promedio) 
        $('#listado_cuestionarios').append("<tr><td width='60%'>" + nombre_temas[i][1] + "<td><td width='40%'><span class='text-success'>Promedio: </span> " + promedio+" <br><span class='text-success'>Exámenes Aprobados: </span> "+aprobados+" <br><span class='text-success'>Exámenes Reprobados: </span>"+reprobados+"</td></tr>")
     
    }

}




async function estadisticas_calificaciones_examenes() {

    var calificacion_examen;
    var bloque_calificaciones=[0,0,0,0,0,0,0,0,0,0];
     
    for (i = 0; i < nombre_temas.length; i++) {
        for (j = 0; j < examenes_filtrados.length; j++) {
            if(examenes_filtrados[j][3]==nombre_temas[i][0]){
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
  //  drawChart2(bloque_calificaciones);
   grafica_histograma_examenes(bloque_calificaciones)


}



async function estadisticas_generales_materia() {
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
    window.location.href = "avance_por_materia.html"; 
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


