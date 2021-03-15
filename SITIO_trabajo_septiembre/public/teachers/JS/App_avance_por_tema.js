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
     
     var consulta= await firebase.firestore().collection('teachers_lessons')
     .orderBy("id_materia","asc")
     .get()
     .then(res=>{
         $('#listado_materias').empty();
         i=1;
         res.forEach(rpta=>{
             
            var fila= rpta.data();
            var clave=rpta.id;
            var id_materia=fila.id_materia;
            var  usuario=fila.id_profesor;
             if(usuario==id_usuario){
                 traer_datos_materia(id_materia,id_usuario); 
             }
         });
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
        
 }
 
 
 
 async  function traer_datos_materia(id_materia,id_usuario){
     console.log("entro: "+id_materia);
     var consulta= await firebase.firestore().collection('lessons')
     .get()
     .then(res=>{
         //$('#listado_materias').empty();
         i=1;
         res.forEach(rpta=>{
             materias_encontradas=1;
             var fila= rpta.data();
             var clave=rpta.id;
             console.log("clave: " + clave)
             var Mimagen=fila.imagen;
             var nombre=fila.nombre
             if (id_materia==clave){
                $('#listado_materias').append("<tr><td><button class=\"btn\" type=\"button\" onclick=\"abrir_temas('"+clave+"','"+nombre+"','"+id_usuario+"')\"><img src=\""+Mimagen+"\"></button></td></tr>"); 
                i=i+1;
             }
         });
        }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
        
        if (materias_encontradas==0){ $('#listado_materias').empty();  $('#listado_materias').append("<br><br><center><h4 class='text-danger'>No tiene almacenada ninguna materia, <br>Por favor vaya a la sección de Mis materias</h4></center><br><br>");}

        
 }
 
 

function abrir_temas(clave,nombre,id_usuario){
    console.log(clave);
    id_materia=clave;
    var liga='avance_listado_por_tema.html?id_materia='+clave+'&nombre_materia='+nombre+'&id_usuario='+id_usuario;
    window.location.href = liga;
}


function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}

