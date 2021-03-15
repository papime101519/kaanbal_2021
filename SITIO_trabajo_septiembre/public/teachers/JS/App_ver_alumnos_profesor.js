var idMateriasAlmacenadas=[];
var nombreMateriasAlmacenadas=[];
var idMateriasProfesor=[];
var idProfesor="";
var idGrupoSeleccionado="";
var idMateriaSeleccionda;
var nombreMateriaSeleccionda;
var fecha_actual=0;

$(document).ready(function(){
    fecha_actual=traer_fecha()
    cargar_funciones();
});

async function cargar_funciones(){

    await profesor_actual();
    await datos_materias();
    await datos_grupos_profesores();
    await llenar_combo_materias();
}


async function profesor_actual(){
    var consulta= await firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          idProfesor=user.uid;
        } else {
          // No user is signed in.
        }
      });
}


async function datos_materias(){
    i=1;
    var consultar= await firebase.firestore().collection('lessons')
    .get()
    .then(res=>{
        MateriasAlmacenadas=[];
        res.forEach(fila=>{
            var datos= fila.data();
            idMateriasAlmacenadas.push(fila.id); 
            nombreMateriasAlmacenadas.push(datos.nombre);
        });          
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
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
            //var idMateria=datos.id_materia;
            var nombre_grupo=datos.nombre_grupo;


            $('#datos_grupos').append("<tr><td>" +  nombre_grupo  + "</td><td><button type='button' class='btn btn-dark text-center'  data-toggle='modal' data-target='#borrar_grupos'  onclick='borrar(\"" + id_grupo + "\");'>Borrar</button></td></tr>");
            
        });	
        if (registros==0){  $('#datos_grupos').append("<br><br><center><h4 class='text-danger'>No tiene almacenado ningun grupo, <br>Por favor Presione el botón de Agregar grupo</h4></center><br><br>");}

           
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}

function listado_materias(){
    firebase.firestore().collection('lessons')
    .onSnapshot(res=>{
        $('#datos_grupos').empty();
        res.forEach(fila=>{
            var fila= fila.data();
            var clave=fila.id;
            var nombre = fila.nombre;
            $('#datos_grupos').append("<tr><td>" +  nombre   + "</td><td><button type='button' class='btn btn-dark text-center'  data-toggle='modal' data-target='#borrar_materias'  onclick='borrar(\"" + clave + "\",\""+nombre+"\");'>Borrar</button></td></tr>");
        });	
    });
}


async function llenar_combo_materias(){
    
    var consulta= await firebase.firestore().collection('teachers_lessons').where('id_profesor','==',idProfesor).get()
    .then(res=>{
        var registros=0;
        $('#combo_materias').empty();
        var i=0;
        res.forEach(fila=>{
            registros+=1;
            var datos= fila.data();
            var idMateria=datos.id_materia;
            var pos = idMateriasAlmacenadas.indexOf(idMateria);
            nombre_materia=nombreMateriasAlmacenadas[pos];
            //idMateriasProfesor.push(idMateria)
            console.log("id_materia: " + idMateria)
           
            if (i==0){var seleccionado='selected'} else {  var seleccionado=' '}
            $('#combo_materias').append("<option value='" +  idMateria   + "' " + seleccionado + " >" +  nombre_materia + "</option>");
            i=i+1;
          
        });	
        
           
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}

$("#salvar_agregar_grupo").click(function(){
            
        var id_materia=$("#combo_materias").val();
        var nombre_grupo=$("#nombre_grupo").val();

        validacion_datos=validar_campos(id_materia,nombre_grupo);
        if (validacion_datos==1){
            mensaje_error='No se proporcionaron con el formato correctamente los datos.'; 
            alert(mensaje_error);
        } else {
             console.log(id_materia);
             console.log(nombre_grupo);
             console.log(idProfesor);


            firebase.firestore().collection('teachers_groups')
             .add({
                 id_materia:id_materia,
                 id_profesor:idProfesor,
                 nombre_grupo:nombre_grupo
             }).then(function(){
                 alert("Se guardo correctamente su grupo")
                 location.reload();

             }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})

        }

});
      
    
async function borrar(idGrupo){
    idGrupoSeleccionado=idGrupo;
    //var mensaje="Registrando materia actual:  clave = " + idGrupo + " idProfesor= " +idProfesor ;
}

async function borrarOK(){
    //var mensaje="preparandose para borrar registros:  clave = " + idGrupo + " idProfesor= " +idProfesor ;
    await borrar_grupo_profesor();   
}

async function borrar_grupo_profesor(){
        
        // Se deben borrar tambien el registro de las tablas asociadas a este grupo como grupos_alumnos

        var consulta_borrar= await  firebase.firestore().collection('teachers_groups').doc(idGrupoSeleccionado).delete()
        .then(function(res){
            //alert("La materia y sus registros fueron borrados satisfactoriamente");
            $('#datos_grupos').empty();
            $('#datos_grupos').append("<br><br><center><h4 class='text-danger'>Espere un momento, estamos procesando su solicitud.</h4></center><br><br>");
            setTimeout(function(){ alert("El grupo fue borrado satisfatoriamente."); location.reload(); }, 2000);

        }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})


}

function traer_fecha(){
    var d = new Date();
    var mes = d.getMonth()+1;
    var dia = d.getDate();
    var anio= d.getFullYear();
    var horas=d.getHours();
    var minutos=d.getMinutes();
    var segundos=d.getSeconds();
    //var fecha=dia+"/"+mes+"/"+anio;

   var fecha_actual=  toTimestamp(anio,mes,dia,horas,minutos,segundos);
   return fecha_actual;
}
  
function toTimestamp(year,month,day,hour,minute,second){
    var datum = new Date(Date.UTC(year,month-1,day,hour,minute,second));
    return datum.getTime()/1000;
}

function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}


function validar_campos(id_materia,nombre){
    var validar=0;
    if(id_materia.length<=0) { validar=1; } 
    if(nombre.length<=0) { validar=1; } 
    return validar;
  }
  