
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


var id_materia= getParameterByName('id_materia');
var nombre_materia= getParameterByName('nombre_materia');
var id_tema= getParameterByName('id_tema');
var nombre_tema= getParameterByName('nombre_tema');

$(document).ready(function () {
    inicializar_pagina();

});

async function inicializar_pagina() {
    $("#nombre_materia_actual").hide();
    $("#lista_datos").hide();
    $("#nombre_materia_actual").empty();
    $("#nombre_materia_actual").append(nombre_tema);
    $('#promedio').empty();
    $('#piechart_3d').empty();
    $('#columnchart_values').empty();

    const id_usuario= await obtener_usuario();

}


async  function obtener_usuario(){
    firebase.auth().onAuthStateChanged(function(user) {
         if (user) {
             id_usuario=firebase.auth().currentUser.uid;
             buscar_registros(id_tema,id_usuario);
             estadisticas_generales_tema(id_materia,id_usuario);
             listado_cuestionarios_por_tema(id_materia,id_usuario);
             avance_por_tema(id_tema,id_usuario);
         } else {
             id_usuario="No existe";
         }    
     });     
 }


 async function avance_por_tema(id_tema,id_usuario){
    console.log("Avance por tema")
    console.log("tema " +id_tema)
    console.log("alumno " +id_usuario)
    
    var registros=0;
    firebase.firestore().collection("students_topics")
    .where("id_tema", "==", id_tema).where("id_alumno","==",id_usuario)
    .get()
    .then(function (querySnapshot) {
        querySnapshot.forEach(function (rpta) {
            registros = registros + 1;
            var fila = rpta.data();
            var calif_promedio=fila.promedio;
            console.log("promedio " + calif_promedio)
            var cuestionarios_aprobados=fila.num_cuestionarios_aprobados;
            var cuestionarios_temas=fila.num_cuestionarios_tema;
            var mensaje="<center><h3><kbd class='text-ligth bg-primary font-weight-bolder  ' >AVANCE: ("+cuestionarios_aprobados+"/"+cuestionarios_temas+" Cuestionarios)  -  Calificación: "+calif_promedio+"</kbd></h3></center>";
            console.log(mensaje);
            $("#avance").append(mensaje);
            
        });

    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}




async function estadisticas_generales_tema(id_materia,id_usuario) {

    console.log('Usuario traido de la funcion:' + id_usuario)

    var num_registros = 0;
    $('#listado_cuestionarios').empty();

    
    firebase.firestore().collection("students-exams").where("id_tema", "==", id_tema).where("id_usuario", "==", id_usuario)
        .get()
        .then(res => {
            $('#listado_cuestionarios').empty();
            res.forEach(rpta => {

                num_registros += 1;
                var fila = rpta.data();
                var nombre_cuestionario = fila.nombre_cuestionario;
                var calificacion_final = fila.calificacion_final;
                //calificaciones_cuestionarios_tema[num_registros]=calificacion_final;
                calificacion_promedio = (calificacion_promedio * (num_registros - 1) + calificacion_final) / num_registros;
                if (calificacion_final >= calificacion_maxima) { calificacion_maxima = calificacion_final; }
                if (calificacion_final <= calificacion_minima) { calificacion_minima = calificacion_final; }
                else {
                    if (calificacion_minima == 0) { calificacion_minima = calificacion_final; }
                }

                if (calificacion_final >= 6) { cuestionarios_aprobados += 1; } else { cuestionarios_reprobados += 1 }
                drawChart(cuestionarios_aprobados, cuestionarios_reprobados)
               
                $('#promedio').empty();
                $('#promedio').append("<center><kbd  class='text-ligth bg-primary font-weight-bolder  '>INTENTOS REALIZADOS: " + num_registros + " /  PROMEDIO: " + calificacion_promedio + " / CALF. MAX: " + calificacion_maxima + " / CALF. MIN: " + calificacion_minima + "</center></kbd>");


            });
        
}).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
        
}


async function listado_cuestionarios_por_tema(id_materia,id_usuario) {

    console.log('Usuario traido de la funcion:' + id_usuario)


    var num_registros = 0;
    console.log('Usuario: ' + id_usuario);
    await firebase.firestore().collection("exams").where("id_tema","==",id_tema).orderBy("descripcion", "desc")
        .get()
        .then(async function (querySnapshot) {
            $('#listado_cuestionarios').empty();
           querySnapshot.forEach(function (rpta) {
                num_registros += 1;
                var fila = rpta.data();
                var clave = rpta.id;
                var descripcion = fila.descripcion;
               
                estadisticas_cuestionario(clave,id_usuario);

            });
            if (num_registros != 0) {

            } else {
                $('#listado_cuestionarios').append("<br><br><center>No se encontraron registros.</center><br><br>");
            }
        
}).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}


async function estadisticas_cuestionario(clave,id_usuario) {

    var calificacion_cuestionario = 0;
    var calificacion_minima = 0;
    var calificacion_maxima = 0;
    var registros = 0;
    var suma = 0;
    var promedio = 0;
    console.log("id_cuestionario: " + clave);

    firebase.firestore().collection("students-exams")
        .where("id_cuestionario", "==", clave).where("id_usuario","==",id_usuario).orderBy("fecha","asc")
        .get()
        .then(function (querySnapshot) {
            var nombre="";
    
            querySnapshot.forEach(function (rpta) {
                registros = registros + 1;
                console.log("entro: " +registros);
                var fila = rpta.data();
                nombre=fila.nombre_cuestionario
                calificacion_cuestionario = fila.calificacion_final;
                drawChart2(calificacion_cuestionario);
                suma = suma + calificacion_cuestionario;
                if (calificacion_cuestionario >= calificacion_maxima) { calificacion_maxima = calificacion_cuestionario; }
                if (calificacion_minima == 0) { calificacion_minima = calificacion_cuestionario; }
                if (calificacion_cuestionario <= calificacion_minima) { calificacion_minima = calificacion_cuestionario; }

            });
            console.log("Numero de registro: " + registros)
            if (registros > 0) { 
                promedio = suma / registros; 
                $('#listado_cuestionarios').append("<tr><td>" + nombre + "<span class='text-danger'></td><td> Intentos realizados:" + registros + " <br> Promedio: " + promedio + " <br> Calif Max: " + calificacion_maxima + " <br> Calif Min: " + calificacion_minima + "</span></td></tr>");
        
            } else { 
                promedio = 0; 
            }

           //$('#listado_cuestionarios').append("<tr><td>" + nombre + "<span class='text-danger'></td><td> Intentos realizados:" + registros + " <br> Promedio: " + promedio + " <br> Calif Max: " + calificacion_maxima + " <br> Calif Min: " + calificacion_minima + "</span></td></tr>");
        

        }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})

}






google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

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


    //google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(drawChart2);



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



function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}





async function buscar_registros(id_tema,id_usuario) {
    

    await firebase.firestore().collection("students-exams")
    .where("id_tema", "==", id_tema)
    .where("id_usuario", "==", id_usuario)
    .get()
    .then(res => {
            $('#ventana_aviso').show();
            res.forEach(rpta => { 
                registros_encontrados=1;          
                $('#ventana_aviso').hide();
                $("#nombre_materia_actual").show();
                $("#lista_datos").show();
            });
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})

}



async function moverse_pagina(){
    window.location.href = "avance_por_tema.html"; 
}

function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}
