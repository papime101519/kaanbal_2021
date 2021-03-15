var id_pregunta=0;

$(document).ready(function(){
    
    //$("#cargar_menu_alumnos").load("alumnos_listado_menu.html");
    //$("#cargar_menu_profesores").load("profesores_listado_menu.html");
    //$("#cargar_menu_preguntas").load("preguntas_listado_menu.html");
    //$("#cargar_menu_cuestionarios").load("cuestionarios_listado_menu.html");


    $("#titulo_encabezado").empty();
    $("#titulo_encabezado").append(`KaanBal Papime 105619`);

    $("#cargar_menu_alumnos").append(`
       <li><a href="ver_alumnos.html">Listado</a></li>
       <li><a href="datos_alumnos.html">Datos del alumno</a></li>
    `);

    $("#cargar_menu_profesores").append(`
    <li><a href="ver_profesores.html">Listado</a></li>
    <li><a href="datos_profesores.html">Datos del profesor</a></li>
 `);


 $("#cargar_menu_materias").append(`
 <li><a href="ver_listado_materias.html">Ver Materias</a></li>
 <li><a href="agregar_materias.html">Agregar Materias</a></li>
 <li><a href="ver_listado_materias_temas.html">Agregar Temas</a></li>
`);

 $("#cargar_menu_preguntas").append(`
 <li><a href="agregar_preguntas.html">Agregar</a></li>
<li><a href="preguntas_listado_por_materias.html">Listado por materia</a></li>
<li><a href="preguntas_listado_por_temas.html">listado por tema</a></li>
`);

$("#cargar_menu_cuestionarios").append(`
<li><a href="agregar_cuestionarios.html">Generar cuestionarios</a></li>
<li><a href="cuestionarios_listado_por_materias.html">Listado por materia</a></li>
<li><a href="cuestionarios_listado_por_temas.html">listado por tema</a></li>
`);



});  
