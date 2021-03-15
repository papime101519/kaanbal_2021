var id_materia=0;




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
     
     var consulta= await firebase.firestore().collection('students_lessons')
     .orderBy("id_materia","asc")
     .get()
     .then(res=>{
         $('#listado_materias').empty();
         i=1;
         res.forEach(rpta=>{
             
             var fila= rpta.data();
             var clave=rpta.id;
             var id_materia=fila.id_materia;
             var  usuario=fila.id_alumno;
             if(usuario==id_usuario){
                 traer_datos_materia(id_materia); 
             }
         });
     }).catch(err=>{
         //console.log('Ocurrio un error');
    
    });
        
 }
 
 
 
 async  function traer_datos_materia(id_materia){
     console.log("entro: "+id_materia);
     var consulta= await firebase.firestore().collection('lessons')
     .get()
     .then(res=>{
         //$('#listado_materias').empty();
         i=1;
         res.forEach(rpta=>{
             var fila= rpta.data();
             var clave=rpta.id;
             console.log("clave: " + clave)
             var Mimagen=fila.imagen;
             var nombre=fila.nombre
             if (id_materia==clave){
                $('#listado_materias').append("<tr><td><button class=\"btn\" type=\"button\" onclick=\"abrir_temas('"+clave+"','"+nombre+"')\"><img src=\""+Mimagen+"\"></button></td></tr>"); 
                i=i+1;
             }
         });
     }).catch(err=>{
         //console.log('Ocurrio un error');
    
    });
 
 
 }
 
 

async function listado_materiasXXXXX(){
    var consulta= await firebase.firestore().collection('lessons').get()
    .then(res=>{
        $('#listado_materias').empty();
        i=1;
        res.forEach(rpta=>{
            var fila= rpta.data();
            var clave=rpta.id;
            var Mimagen=fila.imagen;
            var nombre=fila.nombre;
            $('#listado_materias').append("<tr><td><button class=\"btn\" type=\"button\" onclick=\"abrir_temas('"+clave+"','"+nombre+"')\"><img src=\""+Mimagen+"\"></button></td></tr>"); 
            
            i=i+1;
        });
    }).catch(err=>{
        //console.log('Ocurrio un error');
   
   })
       
}

function abrir_temas(clave,nombre){
    console.log(clave);
    id_materia=clave;
    var liga='avance_listado_por_tema.html?id_materia='+clave+'&nombre_materia='+nombre;
    window.location.href = liga;
}
