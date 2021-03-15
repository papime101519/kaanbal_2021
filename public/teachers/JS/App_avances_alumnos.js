var idMateriasAlmacenadas=[];
var nombreMateriasAlmacenadas=[];
var idMateriasProfesor=[];
var idProfesor="";
var idGrupoSeleccionado="";
var idMateriaSeleccionda;
var nombreMateriaSeleccionda;
var fecha_actual=0;

$(document).ready(function(){
    cargar_funciones();
});

async function cargar_funciones(){

    await profesor_actual();
    //await datos_grupos_profesores();

}


async function profesor_actual(){
    var consulta= await firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          idProfesor=user.uid;
          datos_grupos_profesores();
        } else {
          // No user is signed in.
        }
      });
}


async function datos_grupos_profesores(){
    console.log("Profesor: " +idProfesor);
    $('#datos_grupos').empty();
    var consulta= await firebase.firestore().collection('teachers_groups').where('id_profesor','==',idProfesor).get()
    .then(res=>{
        var registros=0;
        res.forEach(fila=>{
            registros+=1;
            var datos= fila.data();
            var id_grupo=fila.id;
            var id_materia=datos.id_materia;
            var nombre_grupo=datos.nombre_grupo;

            $('#datos_grupos').append("<tr><td>" +  nombre_grupo  + "</td><td><button type='button' class='btn btn-dark text-center'  data-toggle='modal' data-target='#borrar_grupos'  onclick='moverse_pagina(\"" + id_grupo + "\",\""+ nombre_grupo+"\",\""+ id_materia +"\");'>Ver Alumnos </button></td></tr>");
            
        });	
        if (registros==0){  $('#datos_grupos').append("<br><br><center><h4 class='text-danger'>No tiene almacenado ningun grupo, <br>Por favor Presione el botón de Agregar grupo</h4></center><br><br>");}

           
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}

    
async function moverse_pagina(idGrupo,nombre_grupo,id_materia){
    
    var liga='avances_listado_alumnos_por_grupo.html?id_grupo='+idGrupo+'&idProfesor='+idProfesor+'&nombre_grupo='+nombre_grupo+'&id_materia='+id_materia;
    window.location.href = liga; 
}



function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}


  