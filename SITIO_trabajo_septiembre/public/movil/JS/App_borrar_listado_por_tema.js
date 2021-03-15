
var id_materia= getParameterByName('id_materia');
var nombre_materia= getParameterByName('nombre_materia');
var  id_tema_borrar=0;

$(document).ready(function(){
    inicializar_pagina();
});  

async  function inicializar_pagina (){
    $("#titulo_tema").empty();
    $("#titulo_tema").append(nombre_materia);

    await listado_temas();
}


async function listado_temas(){
    
    var consulta= await firebase.firestore().collection('lessons').doc(id_materia).collection('Temas').get()
    .then(res=>{
        $('#listado_temas').empty();
        i=1;
        res.forEach(rpta=>{
            var fila= rpta.data();
            var clave=rpta.id;
            var nombre=fila.nombre;
            $('#listado_temas').append("<tr><td><button class=\"btn\" type=\"button\" onclick=\"abrir_temas('"+clave+"','"+nombre+"')\">"+nombre+"</button></td></tr>"); 
            i=i+1;
        });
    }).catch(err=>{
        //console.log('Ocurrio un error');
   
   })
       
}


function abrir_temas(clave,nombre){
    console.log(clave);
    id_tema_borrar=clave;
     $("#ventana_borrar_temas").show();
}

function cerrar_modal(){
    $("#ventana_borrar_temas").hide();
}

function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje);
}

async function borrar_tema(){

    $("#ventana_borrar_temas").hide();

    var id_usuario = firebase.auth().currentUser.uid;
    
    var borrar_consulta = await firebase.firestore().collection('students-exams')
    .where("id_usuario","==",id_usuario)
    .where("id_materia","==",id_materia)
    .where("id_tema","==",id_tema_borrar);
    
    await borrar_consulta.get()
    .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
    }).then(function(){
        alert("Se borraron correctamente los avances.");
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);
    });

}

/*
$("#eliminar").on('click', function(evt){
    evt.preventDefault();
    $("#ventana_borrar_temas").hide();

    var id_usuario = firebase.auth().currentUser.uid;
    
    var borrar_consulta = firebase.firestore().collection('students-exams')
    .where("id_usuario","==",id_usuario)
    .where("id_materia","==",id_materia)
    .where("id_tema","==",id_tema_borrar);
    
    borrar_consulta.get()
    .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
            doc.ref.delete();
    })
    .then(function(){
        alert("Se borraron correctamente los avances.");
    })
    .catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
    

})
*/