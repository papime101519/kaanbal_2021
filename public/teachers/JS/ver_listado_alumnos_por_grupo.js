

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


            $('#listado_datos_alumnos').append("<tr><td>" +  nombre_alumno  + "</td><td><button type='button' class='btn btn-dark text-center'  data-toggle='modal' data-target='#ventana_borrar_alumnos'  onclick='borrar(\"" + id_alumno + "\");'>Borrar</button></td></tr>");
            
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


async function salvar_alumno_grupo(){
    

        // verificar si el usuario ya esta almacenado en el grupo

        var clave_alumno=$("#clave_alumno").val();
        await traer_datos_alumno(clave_alumno);
        await verificar_grupo_alumno(clave_alumno);


        validacion_datos=validar_campos(clave_alumno);
        if (validacion_datos==1 || AlumnoAlmacenado>0){
            mensaje_error='No se proporcionó el ID del alumno o el alumno ya esta registrado en este grupo'; 
            alert(mensaje_error);
        } else {

            firebase.firestore().collection('students_groups')
             .add({
                 id_materia:id_materia,
                 id_profesor:idProfesor,
                 id_alumno: clave_alumno,
                 id_grupo:id_grupo,
                 nombre_alumno:NombreAlumnoSeleccionado,
                 
             }).then(function(){
                 alert("Se guardo correctamente su alumno")
                 location.reload();

             }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})

        }


}
$("#salvar_agregar_alumno").click(function(){    
        salvar_alumno_grupo();
});
      
    
async function borrar(idAlumno){
    idAlumnoSeleccionado=idAlumno;
   
}

async function borrarOK(){
    await borrar_alumno_grupo();   
}

async function borrar_alumno_grupo(){
        
    // Se deben borrar tambien el registro de las tablas asociadas a este grupo como grupos_alumnos

    //alert("alumno:" + idAlumnoSeleccionado +"grupo:" + id_grupo)

    var borrar_consulta = await firebase.firestore().collection('students_groups')
        .where("id_alumno","==",idAlumnoSeleccionado)
        .where("id_grupo","==",id_grupo);
    borrar_consulta.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.delete();
            $('#listado_datos_alumnos').empty();
            $('#listado_datos_alumnos').append("<br><br><center><h4 class='text-danger'>Espere un momento, estamos procesando su solicitud.</h4></center><br><br>");
            setTimeout(function(){ alert("El alumno fue borrado satisfatoriamente de este grupo."); location.reload(); }, 2000);
        });
    });

}


function validar_campos(clave_alumno){
    var validar=0;
    if(clave_alumno.length<=0) { validar=1; }  
    return validar;
}
  

function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}
