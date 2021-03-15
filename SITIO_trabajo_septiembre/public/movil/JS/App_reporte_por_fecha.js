var id_materia=0;
var materias_encontradas=0;


$(document).ready(function(){
    inicializar_pagina();
});  


async  function inicializar_pagina (){
    // await listado_materias();
    const id_usuario= await obtener_usuario();
 }
 
 
 async  function obtener_usuario(){
     firebase.auth().onAuthStateChanged(function(user) {
           if (user) {
               id_usuario=firebase.auth().currentUser.uid;
               listado_materias_por_usuario(id_usuario);
           } else {
               id_usuario="No existe";
           }    
       });     
   }
  
 
 
async function listado_materias_por_usuario(id_usuario){
     
     var consulta= await firebase.firestore().collection('students-exams')
     .orderBy("fecha","desc")
     .get()
     .then(res=>{
         $('#listado_materias').empty();
         i=1;
         res.forEach(rpta=>{
             console.log("Entro: " +id_usuario);
             
             var fila= rpta.data();
             //var clave=rpta.id;
             //var id_materia=fila.id_materia;
             var fecha=fila.fecha;
             var theDate = new Date(fecha * 1000);
             d = theDate.toGMTString();
    
             var calificacion_final=fila.calificacion_final;
             var  usuario=fila.id_usuario;
             var nombre=fila.nombre_cuestionario;
             var id_materia=fila.id_materia;
             if(usuario==id_usuario){
                 materias_encontradas=1;
                 traer_nombre_materia(id_materia,nombre,calificacion_final,d)
                 i=i+1;
             }
         });
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
    
    if (materias_encontradas==0){ $('#listado_materias').empty();  $('#listado_materias').append("<br><br><center><h4 class='text-danger'>No tiene registrado ningún examen, <br>Por favor vaya a la sección de Jugar.</h4></center><br><br>");}

    
 }

 async function traer_nombre_materia(id_materia,nombre,calificacion_final,d){
    
    var consulta= await firebase.firestore().collection('lessons')
     .get()
     .then(res=>{
         res.forEach(rpta=>{
            
            var fila= rpta.data();
            var clave=rpta.id;
             if(clave==id_materia){
                var nombre_materia=fila.nombre;
                $('#listado_materias').append("<tr><td><span class='text-danger'>Nombre del cuestionario:</span> "+ nombre+"<br><span class='text-danger'>Calificacion: </span>"+calificacion_final+"<br><span class='text-danger'>Materia:</span> "+nombre_materia+"<br><span class='text-danger'>Fecha de realización:</span> "+d+"</td></tr>");   
             }
        });
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
   
 }
 
 
 
 
function abrir_temas(clave,nombre){
    console.log(clave);
    id_materia=clave;
    var liga='reporte_por_materia.html?id_materia='+clave+'&nombre_materia='+nombre;
    window.location.href = liga;
}


function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}