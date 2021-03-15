

var idAlumnoSeleccionado="";
var idMateriaSeleccionda;
var nombreMateriaSeleccionda;
var AlumnoAlmacenado=0
var NombreAlumnoSeleccionado=""

var id_grupo= getParameterByName('id_grupo');
var idProfesor= getParameterByName('idProfesor');
var nombre_grupo= getParameterByName('nombre_grupo');
var id_materia= getParameterByName('id_materia');


$(document).ready(function(){
    cargar_funciones();
});

async function cargar_funciones(){

    $("#nombre_grupo").empty();
    $("#nombre_grupo").append("<center>"+nombre_grupo+"</center>");

    await datos_grupos_alumnos();

}


async function datos_grupos_alumnos(){
    console.log("Profesor: " +idProfesor);
    $('#listado_datos_alumnos').empty();
    var consulta= await firebase.firestore().collection('students_groups')
    .where('id_grupo','==',id_grupo)
    .get()
    .then(res=>{
        var registros=0;
        res.forEach(fila=>{
            registros+=1;
            var datos= fila.data();
            var id_alumno=datos.id_alumno;
            //var idMateria=datos.id_materia;
            var nombre_alumno=datos.nombre_alumno;


            $('#listado_datos_alumnos').append("<tr><td>" +  nombre_alumno  + "</td><td><button type='button' class='btn btn-dark text-center'  onclick='moverse_pagina(\"" + id_alumno + "\",\""+ nombre_alumno +"\");'>Ver Estadísticas</button></td></tr>");
            
        });	
        if (registros==0){  $('#listado_datos_alumnos').append("<br><br><center><h4 class='text-danger'>No tiene almacenado ningun alumno, <br>Por favor Presione el botón de Agregar alumno</h4></center><br><br>");}

           
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}


async function traer_datos_alumno(id_alumno){
    var consulta= await firebase.firestore().collection('students').doc(id_alumno)
    .get()
    .then(res=>{
        fila= res.data();
        NombreAlumnoSeleccionado = fila.nombre;
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}



async function verificar_grupo_alumno(id_alumno){
    var consulta= await firebase.firestore().collection('students_groups')
    .where("id_grupo","==",id_grupo)
    .where("id_alumno","==",id_alumno)
    .get()
    .then(res=>{
        var registros=0;
        res.forEach(fila=>{
            registros+=1;
        });	
        if (registros>0){ AlumnoAlmacenado=1; } else {AlumnoAlmacenado=0; }
     
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
    
}

async function moverse_pagina(idAlumno,nombre_alumno){
    window.location.href = "reporte_alumnos.html?id_grupo="+id_grupo+"&id_usuario="+idProfesor+"&id_alumno="+idAlumno+"&nombre_grupo="+nombre_grupo+"&id_materia="+id_materia+"&nombre_alumno="+nombre_alumno; 
}


function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}
