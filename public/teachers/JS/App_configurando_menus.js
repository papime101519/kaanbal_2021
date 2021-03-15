var id_pregunta=0;

$(document).ready(function(){
    
   $("#titulo_encabezado").empty();
   $("#titulo_encabezado").append(`KaanBal Papime 105619`);

    $("#cargar_menu_profesores").append(`
       <li><a href="datos_profesores.html">Modificar datos</a></li>
    `);


    $("#cargar_menu_materias").append(`
    <li><a href="ver_materias_profesor.html">Mis materias</a></li>

 `);

    $("#cargar_menu_grupos").append(`
    <li><a href="ver_grupos_profesor.html">Mis grupos</a></li>

 `);

 $("#cargar_menu_alumnos").append(`
   <li><a href="ver_listado_grupos_alumnos.html">Mis alumnos por grupo</a></li>
   
`);

 $("#cargar_menu_reportes").append(`
<li><a href="avance_por_materia.html">Por materia</a></li>
<li><a href="avance_por_tema.html">Por temas</a></li>
<li><a href="avances_grupo.html">Por grupo</a></li>
<li><a href="avances_alumnos.html">Por alumno</a></li>
`);


});  
