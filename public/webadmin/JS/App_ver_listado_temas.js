var idTemaSeleccionado;
var nombreTemaSeleccionado;

var id_materia= getParameterByName('id_materia');
var nombre_materia= getParameterByName('nombreMateria');


$(document).ready(function(){
    cargar_funciones();
});

async function cargar_funciones(){
    if (id_materia=="Trigonometria" || id_materia=="AntecedentesAlgebra" ){
        $("#boton_agregar_temas").hide();
    }
    $("#nombre_materia_seleccionada").empty();
    $("#nombre_materia_seleccionada").append("<center>"+nombre_materia+"</center>");
    await datos_temas_por_materia();
}


async function datos_temas_por_materia(){
    //alert("id_materia: " +id_materia)
    var consulta= await firebase.firestore().collection('lessons').doc(id_materia).collection('Temas')
    .orderBy("num_tema","asc")
    .get()
    .then(res=>{
        var registros=0;
        res.forEach(fila=>{
            registros+=1;
            var datos= fila.data();
            var idTema=fila.id;
            nombre=datos.nombre
            num_tema=datos.num_tema
            console.log('clave tema: ' + idTema)
            console.log('nombre materia: ' + nombre)
            //$('#mostrar_datos').append("<tr><td>" +  nombre  + "</td><td><button type='button' class='btn btn-dark text-center'  data-toggle='modal' data-target='#borrar_materias'  onclick='borrar(\"" + idTema + "\");'>Borrar</button></td></tr>");
            cadena_renglon="<tr><td>"+num_tema+ ") " +  nombre  + "</td>"
            if (id_materia!="Trigonometria" && id_materia!="AntecedentesAlgebra" ){
                cadena_renglon=cadena_renglon+"<td><button type='button' class='btn btn-dark text-center'  data-toggle='modal' data-target='#borrar_materias'  onclick='borrar(\"" + idTema + "\");'>Borrar</button></td></tr>";
            } else {
                cadena_renglon=cadena_renglon+"</tr>"
            }
            $('#mostrar_datos').append(cadena_renglon)

        });	
        if (registros==0){  $('#mostrar_datos').append("<br><br><center><h4 class='text-danger'>No tiene almacenado ningún tema, <br>Por favor Presione el botón de AGREGAR</h4></center><br><br>");}

           
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}

  
async function  moverse_pagina(){

    window.location.href = "agregar_temas.html?id_materia="+id_materia+"&nombre_materia="+nombre_materia; 
}
async function borrar(idTema){
    idTemaSeleccionado=idTema;
    //var mensaje="Registrando materia actual:  clave = " + idTemaSeleccionado + " idProfesor= " +idProfesor ;
}

async function borrarOK(){
    //var mensaje="preparandose para borrar registros:  clave = " + idTemaSeleccionado + " idProfesor= " +idProfesor ;

     await borrar_tema_sistema();   
}

async function borrar_tema_sistema(){

        // Se deben borrar tambien el registro de las tablas asociadas a la materia como grupos_alumnos
       // var mensaje="preparandose para borrar materia:  clave = " + idTemaSeleccionado + " idProfesor= " +idProfesor ;
       // alert(mensaje)

        var jobskill_query = await firebase.firestore().collection('lessons')
        .doc(id_materia)
        .collection("Temas")
        .doc(idTemaSeleccionado);
        await jobskill_query.get().then(async function(querySnapshot) {
            //await querySnapshot.forEach(function(doc) {
                querySnapshot.ref.delete();
                console.log("Se borro la Materia")   
            //});
        
        }).then(function(){
            //alert("La materia y sus registros fueron borrados satisfactoriamente");
            $('#mostrar_datos').empty();
            $('#mostrar_datos').append("<br><br><center><h4 class='text-danger'>Espere un momento, estamos procesando su solicitud.</h4></center><br><br>");
            setTimeout(function(){ alert("El tema fue borrado satisfatoriamente."); location.reload(); }, 3000);

        }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})


}

 
function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}