var id_pregunta=0;

$(document).ready(function(){

   $("#titulo_encabezado").empty();
   $("#titulo_encabezado").append(`KaanBal Papime 105619`);
    
    $("#cargar_menu_alumnos").append(`
       <li><a href="datos_alumnos.html" ><font class="elemento_menu">Modificar datos</font></a></li>
    `);

    $("#cargar_menu_clases").append(`
    <li><a href="ver_materias_alumno.html">Mis materias</a></li>
 `);

 $("#cargar_menu_tutoriales").append(`
<li><a href="practica_materias.html">Seleccione una materia</a></li>
<li><a href="borrar_avances_materias.html">Borrar Avances por materia</a></li>
<li><a href="borrar_por_tema.html">Borrar Avance por tema</a></li>
`);

 $("#cargar_menu_avance").append(`
<li><a href="avance_por_materia.html">Por materia</a></li>
<li><a href="avance_por_tema.html">Por tema</a></li>
<li><a href="reporte_por_fecha.html">Por fecha</a></li>

`);

$("#cargar_menu_grupos").append(`
<li><a href="obtener_id_alumno.html">Obtener ID</a></li>

`);


});  
