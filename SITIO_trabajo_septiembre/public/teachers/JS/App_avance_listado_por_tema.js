
var id_materia= getParameterByName('id_materia');
var nombre_materia= getParameterByName('nombre_materia');
var id_usuario= getParameterByName('id_usuario');

$(document).ready(function(){
    inicializar_pagina();
});  

async  function inicializar_pagina (){
    $("#titulo_tema").empty();
    $("#titulo_tema").append(nombre_materia);

    await listado_temas();
}


async function listado_temas(){
    
    var consulta= await firebase.firestore().collection('lessons').doc(id_materia).collection('Temas')
    .orderBy("num_tema", "asc")
    .get()
    .then(res=>{
        $('#listado_temas').empty();
        i=1;
        res.forEach(rpta=>{
            var fila= rpta.data();
            var clave=rpta.id;
            var nombre=fila.nombre;
            var num_tema = fila.num_tema;
            $('#listado_temas').append("<tr><td><button class=\"btn\" type=\"button\" onclick=\"abrir_temas('"+clave+"','"+nombre+"')\">"+num_tema+") "+nombre+"</button></td></tr>"); 
            i=i+1;
        });
    }).catch(err=>{
        //console.log('Ocurrio un error');
   
   })
       
}

function abrir_temas(clave,nombre){
    console.log(clave);
    var liga='reporte_por_tema.html?id_materia='+id_materia+'&nombre_materia='+nombre_materia+'&id_tema='+clave+'&nombre_tema='+nombre+'&id_usuario='+id_usuario;
    window.location.href = liga;
}
