var id_materia= getParameterByName('id_materia');
var id_tema= getParameterByName('id_tema');
var nombre_tema=getParameterByName('nombre_materia');
var id_usuario = ""


$(document).ready(function(){
    inicializar_pagina();
});  

async  function inicializar_pagina (){

    $('#titulo_materia').append(nombre_tema);
    await obtener_usuario();
    console.log('Usuario: ' + id_usuario);
    await listadoCuestionarios(id_materia,id_tema);
    
    
}

async  function obtener_usuario(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            id_usuario = firebase.auth().currentUser.uid;
            console.log('Usuario: ' + id_usuario);
            //return id_usuario;        
        } else {
            id_usuario=0;
            //return id_usuario=0;
        }
            
        
    });

}



async function listadoCuestionarios(id_materia,id_tema){
    var num_registros=0;
    

    firebase.firestore().collection("exams").where("id_materia","==",id_materia).where("id_tema","==",id_tema).orderBy("descripcion", "desc")
    .get()
    .then(function(querySnapshot) {
        $('#listado_cuestionarios').empty();
        querySnapshot.forEach(function(rpta) {
            num_registros+=1;
            var fila= rpta.data();
            var clave=rpta.id;
            var descripcion = fila.descripcion;
            console.log(descripcion)

            estadisticas_cuestionario(clave,descripcion);
           // $('#listado_cuestionarios').append("<tr><td><img src='../../img/cuestionarios.png' heigth='25%' ></td><td>" +  descripcion  + "</td><td><button type='button' class='btn btn-dark text-center' data-toggle='modal' data-target='#modificar_preguntas'   onclick='ver_cuestionario(\"" + clave + "\");'>Practicar</button></td></tr>"); 

           
        });
        if (num_registros!=0){ 
            //$("#lista_preguntas").show();
        } else {
            $('#listado_cuestionarios').append("<br><br><center>No se encontraron registros.</center><br><br>");
        }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}


function ver_cuestionario(clave){
    var liga='mostrar_cuestionario.html?id_cuestionario='+clave+'&id_materia='+id_materia+'&nombre_tema='+nombre_tema+'&id_tema='+id_tema;
        //console.log(liga);
        window.location.href = liga;
}


async function estadisticas_cuestionario(clave,descripcion){

    var calificacion_cuestionario=0;
    var calificacion_minima=0;
    var calificacion_maxima=0;
    var registros=0;
    var suma=0;
    var promedio=0;
    console.log("id_cuestionario: "+ clave);

    //id_usuario="ISNRZH3hT3UoTBoCuEFWtGWFR0b2";

    firebase.firestore().collection("students-exams")
    .where("id_cuestionario","==",clave).where("id_usuario","==",id_usuario)
    .get()
    .then(function(querySnapshot) {  
        querySnapshot.forEach(function(rpta) {
            registros=registros+1;
            var fila= rpta.data();
            calificacion_cuestionario=fila.calificacion_final;
            suma=suma+calificacion_cuestionario;
            if (calificacion_cuestionario>=calificacion_maxima){calificacion_maxima=calificacion_cuestionario;}
            if (calificacion_minima==0){calificacion_minima=calificacion_cuestionario;}
            if (calificacion_cuestionario<=calificacion_minima){calificacion_minima=calificacion_cuestionario;}
            
        });
        console.log("Numero de registro: " + registros)
        if (registros>0) { promedio=suma/registros; } else { promedio=0; }
        //$('#listado_cuestionarios').empty();
        $('#listado_cuestionarios').append("<tr><td><img src='../../img/cuestionarios.png' heigth='25%' ></td><td>" +  descripcion  + "<span class='text-danger'><br><br> Intentos realizados:"+ registros+" <br> Promedio: " +promedio + " <br> Calif Max: "+ calificacion_maxima+" <br> Calif Min: "+ calificacion_minima +"</span></td><td><button type='button' class='btn btn-dark text-center' data-toggle='modal' data-target='#modificar_preguntas'   onclick='ver_cuestionario(\"" + clave + "\");'>Practicar</button></td></tr>");         
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
   
}

function borrar(clave){
    //alert('borrar');
    id_pregunta=clave;

}


$("#enviar").on('click', function(evt){

    evt.preventDefault();
    var descripcion=($("#descripcion").val()).trim();
    var sugerencias=($("#sugerencias").val()).trim();
    var URLimagen=($("#URLimagen").val()).trim();
    var URLvideo=($("#URLvideo").val()).trim();
    var respuesta=($("#respuesta").val()).trim();
    var tipo_pregunta=$("#tipo_pregunta").val();
    var id_materia=$("#materias").val();
    var id_tema=$("#temas").val();

    console.log('materia: ' + id_materia);
    console.log('tema: ' + id_tema);
    validacion_datos=validar_campos(descripcion,sugerencias,respuesta);
    if (validacion_datos==1){
        mensaje_error='Se encontraron campos datos vacios.'; 
        alert(mensaje_error);
    } else {

        /////////////////////////////////////////////////
        firebase.firestore().collection('questions')
        .add({
              descripcion:descripcion,
              sugerencias:sugerencias,
              URLimagen:URLimagen,
              URLvideo:URLvideo,
              id_materia:id_materia,
              id_tema:id_tema,
              tipo_pregunta:tipo_pregunta,
              respuesta:respuesta

        }).then(res=>{
            alert('Se agrego correctamente la pregunta');
            window.location.href = "agregar_preguntas.html"; 
        }).catch(err=>{
          // error 
        })
      
  
        ////////////////////////////////////////////////
    }
  
  });
  

function validar_campos(descripcion,sugerencia,respuesta){
    var validar=0;
  
    if(descripcion.length<=0) { validar=1; } 
    if(respuesta.length<=0) { validar=1; }
    if(sugerencia.length<=0) { validar=1; }
    if(respuesta.length<=0) { validar=1; }
    return validar;
  }
  
  function validarEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test( $email );
  }
  
  