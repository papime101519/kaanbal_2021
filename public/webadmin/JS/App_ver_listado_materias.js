var idMateriaSeleccionda;
var nombreMateriaSeleccionda;


$(document).ready(function(){
    cargar_funciones();
});

async function cargar_funciones(){
    await datos_materias_profesores();
}


async function datos_materias_profesores(){
    var consulta= await firebase.firestore().collection('lessons').get()
    .then(res=>{
        var registros=0;
        res.forEach(fila=>{
            registros+=1;
            var datos= fila.data();
            var idMateria=fila.id;
            nombre=datos.nombre

            console.log('clave materia: ' + idMateria)
            console.log('nombre materia: ' + nombre)
            $('#datos_materias').append("<tr><td>" +  nombre  + "</td><td><button type='button' class='btn btn-dark text-center'  data-toggle='modal' data-target='#borrar_materias'  onclick='borrar(\"" + idMateria + "\");'>Borrar</button></td></tr>");
            
        });	
        if (registros==0){  $('#datos_materias').append("<br><br><center><h4 class='text-danger'>No tiene almacenada ninguna materia, <br>Por favor Presione el botón de Agregar Materia</h4></center><br><br>");}

           
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}

  
async function  moverse_pagina(){
    window.location.href = "agregar_materias.html"; 
}
async function borrar(idMateria){
    idMateriaSeleccionda=idMateria;
    //var mensaje="Registrando materia actual:  clave = " + idMateriaSeleccionda + " idProfesor= " +idProfesor ;
}

async function borrarOK(){
    //var mensaje="preparandose para borrar registros:  clave = " + idMateriaSeleccionda + " idProfesor= " +idProfesor ;
    if (idMateriaSeleccionda=="Trigonometria" || idMateriaSeleccionda=="AntecedentesAlgebra" ){
        alert("Esta materia por seguridad no puede ser borrada porque forma parte de las materias básicas de la aplicación. ")
    } else {
        await borrar_materia_sistema();
    }   
}

async function borrar_materia_sistema(){

        // Se deben borrar tambien el registro de las tablas asociadas a la materia como grupos_alumnos
       // var mensaje="preparandose para borrar materia:  clave = " + idMateriaSeleccionda + " idProfesor= " +idProfesor ;
       // alert(mensaje)

        var jobskill_query = await firebase.firestore().collection('lessons').doc(idMateriaSeleccionda);
        await jobskill_query.get().then(async function(querySnapshot) {
            //await querySnapshot.forEach(function(doc) {
                querySnapshot.ref.delete();
                console.log("Se borro la Materia")   
            //});
        
        }).then(function(){
            //alert("La materia y sus registros fueron borrados satisfactoriamente");
            $('#datos_materias').empty();
            $('#datos_materias').append("<br><br><center><h4 class='text-danger'>Espere un momento, estamos procesando su solicitud.</h4></center><br><br>");
            setTimeout(function(){ alert("La materia fue borrada satisfatoriamente."); location.reload(); }, 3000);

        }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})


}

 
function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}