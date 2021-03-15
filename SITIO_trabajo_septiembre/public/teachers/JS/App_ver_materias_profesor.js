var idMateriasAlmacenadas=[];
var nombreMateriasAlmacenadas=[];
var idMateriasProfesor=[];
var idProfesor="";
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
    await datos_materias_profesores();
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
            if (i==0){var seleccionado='selected'} else {  var seleccionado=' '}
            $('#combo_materias').append("<option value='" +  fila.id   + "' " + seleccionado + " >" +  datos.nombre + "</option>");
            i=i+1;
        });
              
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}

async function datos_materias_profesores(){
    console.log("Profesor: " +idProfesor);
    $('#datos_materias').empty();
    var consulta= await firebase.firestore().collection('teachers_lessons').where('id_profesor','==',idProfesor).get()
    .then(res=>{
        var registros=0;
        res.forEach(fila=>{
            registros+=1;
            var datos= fila.data();
            var clave=fila.id;
            var idMateria=datos.id_materia;
            var pos = idMateriasAlmacenadas.indexOf(idMateria);
            nombre=nombreMateriasAlmacenadas[pos];
            idMateriasProfesor.push(idMateria)
            console.log('posicion '+ pos);
            console.log('clave materia: ' + idMateria)
            console.log('nombre materia: ' + nombre)
            $('#datos_materias').append("<tr><td>" +  nombre  + "</td><td><button type='button' class='btn btn-dark text-center'  data-toggle='modal' data-target='#borrar_materias'  onclick='borrar(\"" + idMateria + "\");'>Borrar</button></td></tr>");
            
        });	
        if (registros==0){  $('#datos_materias').append("<br><br><center><h4 class='text-danger'>No tiene almacenada ninguna materia, <br>Por favor Presione el botón de Agregar Materia</h4></center><br><br>");}

           
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
}

function listado_materias(){
    firebase.firestore().collection('lessons')
    .onSnapshot(res=>{
        $('#datos_materias').empty();
        res.forEach(fila=>{
            var fila= fila.data();
            var clave=fila.id;
            var nombre = fila.nombre;
            $('#datos_materias').append("<tr><td>" +  nombre   + "</td><td><button type='button' class='btn btn-dark text-center'  data-toggle='modal' data-target='#borrar_materias'  onclick='borrar(\"" + clave + "\",\""+nombre+"\");'>Borrar</button></td></tr>");
        });	
    });
}


function llenar_combo_materias(){
    firebase.firestore().collection('lessons')
    .onSnapshot(res=>{
        $('#combo_materias').empty();
        res.forEach(fila=>{
            var datos= fila.data();
            var clave=fila.id;
            var nombre = datos.nombre;
            $('#combo_materias').append("<option value='" + clave + "'>" + nombre + "</option>"); 
        });	 
    });
}

    
$("#salvar_agregar_materia").click(function(){
            
        var id_materia=$("#combo_materias").val();
        var id_profesor=idProfesor;

       // console.log(id_materia);
       // console.log(id_profesor);
       // console.log(idMateriasAlmacenadas);

        var pos = idMateriasProfesor.indexOf(id_materia);
        console.log(pos)
        if (pos<0){
                firebase.firestore().collection('teachers_lessons')
                .add({
                    id_materia:id_materia,
                    id_profesor:id_profesor
                }).then(function(){
                    location.reload();

                }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
        } else {
            alert('La materia ya se encontraba almacenada');
             
        }

});
      
    
async function borrar(idMateria){
    idMateriaSeleccionda=idMateria;
    var mensaje="Registrando materia actual:  clave = " + idMateriaSeleccionda + " idProfesor= " +idProfesor ;
}

async function borrarOK(){
    var mensaje="preparandose para borrar registros:  clave = " + idMateriaSeleccionda + " idProfesor= " +idProfesor ;
    await borrar_materia_profesor();   
}

async function borrar_materia_profesor(){

        // Se deben borrar tambien el registro de las tablas asociadas al profesor como grupos_alumnos
        var mensaje="preparandose para borrar materia:  clave = " + idMateriaSeleccionda + " idProfesor= " +idProfesor ;
       // alert(mensaje)

        var jobskill_query = await firebase.firestore().collection('teachers_lessons')
        .where('id_profesor','==',idProfesor)
        .where('id_materia','==',idMateriaSeleccionda);
        await jobskill_query.get().then(async function(querySnapshot) {
            await querySnapshot.forEach(function(doc) {
                doc.ref.delete();
                console.log("Se borro la Materia")   
            });
        
        }).then(function(){
            //alert("La materia y sus registros fueron borrados satisfactoriamente");
            $('#datos_materias').empty();
            $('#datos_materias').append("<br><br><center><h4 class='text-danger'>Espere un momento, estamos procesando su solicitud.</h4></center><br><br>");
            setTimeout(function(){ alert("La materia fue borrada satisfatoriamente."); location.reload(); }, 3000);

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