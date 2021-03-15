$id_materia="";
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
                materias_encontradas=1;
                traer_datos_materia(id_materia); 
            }
        });
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})

    if (materias_encontradas==0){ $('#listado_materias').empty();  $('#listado_materias').append("<br><br><center><h4 class='text-danger'>No tiene almacenada ninguna materia, <br>Por favor vaya a la sección de Mis materias</h4></center><br><br>");}

       
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
                $('#listado_materias').append("<tr><td><button class=\"btn\" type=\"button\" onclick=\"borrar('"+clave+"')\"><img src=\""+Mimagen+"\"></button></td></tr>"); 
                i=i+1;
            }
        });
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})

}


function borrar(clave){
    console.log(clave);
    id_materia=clave;
    $("#borrar_avance_materia").show();

}

function cerrar_modal(){
    $("#borrar_avance_materia").hide();
}


$("#eliminar").on('click', function(evt){
    evt.preventDefault();
    $("#borrar_avance_materia").hide();
    console.log('Listo para borrar');
    var id_usuario = firebase.auth().currentUser.uid;
    //window.history.back();
    //window.location.href = "borrar_avances_materias.html"; 


    var borrar_consulta = firebase.firestore().collection('students-exams').where("id_usuario","==",id_usuario).where("id_materia","==",id_materia);
        borrar_consulta.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
            doc.ref.delete();
        });
    });
    

    function mostrar_mensaje_error(codigo,mensaje){
        mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
        console.log(mensaje)
    }


    /*
    firebase.firestore().collection('students-exams').delete()
    .where("id_usuario","==",id_usuario).where("id_materia","==",id_materia).then(res=>{
        location.reload();
    }).catch(err=>{
        // en caso de error
    });
    */
    
})


  
