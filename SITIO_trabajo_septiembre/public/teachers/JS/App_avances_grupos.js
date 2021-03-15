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
    var consulta= await firebase.firestore().collection('teachers_groups').where('id_profesor','==',idProfesor)
    .orderBy("nombre_grupo","asc")
    .get()
    .then(res=>{
        var registros=0;
        res.forEach(fila=>{
            registros+=1;
            var datos= fila.data();
            var id_grupo=fila.id;
            //var idMateria=datos.id_materia;
            var nombre_grupo=datos.nombre_grupo;
            var id_materia=datos.id_materia;

            $('#datos_grupos').append("<tr><td>" +  nombre_grupo  + "</td><td><button type='button' class='btn btn-dark text-center'    onclick='moverse_pagina(\"" + id_grupo + "\",\""+nombre_grupo+"\",\""+id_materia+"\");'>Ver Estadísticas</button></td></tr>");
            
        });	
        if (registros==0){  $('#datos_grupos').append("<br><br><center><h4 class='text-danger'>No tiene almacenado ningun grupo, <br>Por favor Presione el botón de Agregar grupo</h4></center><br><br>");}

           
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
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
   
    
async function moverse_pagina(idGrupo,nombre_grupo,id_materia){
    window.location.href = "reporte_grupos.html?id_grupo="+idGrupo+"&id_usuario="+idProfesor+"&id_materia="+id_materia+"&nombre_grupo="+nombre_grupo; 
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
  