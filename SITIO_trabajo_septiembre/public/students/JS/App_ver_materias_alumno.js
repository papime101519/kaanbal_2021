var idMateriasAlmacenadas=[];
var nombreMateriasAlmacenadas=[];
var idMateriasAlumno=[];
var idAlumno="";
var idMateriaSeleccionda;
var nombreMateriaSeleccionda;
var fecha_actual=0;
var materias_encontradas=0;

$(document).ready(function(){
    fecha_actual=traer_fecha()
    //console.log(fecha_actual);
    cargar_funciones();
});

async function cargar_funciones(){

    await alumno_actual();
    await datos_materias();
    await datos_materias_alumnos();
}


async function alumno_actual(){
    var consulta= await firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          idAlumno=user.uid;
        } else {
          // No user is signed in.
        }
      });
}


async function datos_materias(){
    i=1;
    // console.log("Alumno: " +idAlumno);
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

async function datos_materias_alumnos(){
    console.log("Alumno: " +idAlumno);
    $('#datos_materias').empty();
    var consulta= await firebase.firestore().collection('students_lessons').where('id_alumno','==',idAlumno).get()
    .then(res=>{
        
        res.forEach(fila=>{
            var datos= fila.data();
            var clave=fila.id;
            var idMateria=datos.id_materia;
            var pos = idMateriasAlmacenadas.indexOf(idMateria);
            nombre=nombreMateriasAlmacenadas[pos];
            idMateriasAlumno.push(idMateria)
            console.log('posicion '+ pos);
            console.log('clave materia: ' + idMateria)
            console.log('nombre materia: ' + nombre)
            $('#datos_materias').append("<tr><td>" +  nombre  + "</td><td><button type='button' class='btn btn-dark text-center'  data-toggle='modal' data-target='#borrar_materias'  onclick='borrar(\"" + idMateria + "\");'>Borrar</button></td></tr>");
            materias_encontradas=1;
        });	
           
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})

    if (materias_encontradas==0){ 
        $('#datos_materias').empty();
        $('#datos_materias').append("<br><br><center><h4 class='text-danger'>No tiene almacenada ninguna materia, <br>Por favor presione el botón de Agregar.</h4></center><br><br>");}
    }


async function traer_nombre_materia(clave){

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
        var id_alumno=idAlumno;

       // console.log(id_materia);
       // console.log(id_alumno);
       // console.log(idMateriasAlmacenadas);
       

        var pos = idMateriasAlumno.indexOf(id_materia);
        console.log(pos)
        if (pos<0){
                //console.log('entro')
                firebase.firestore().collection('students_lessons')
                .add({
                    numero_temas_materia:0,
                    numero_temas_aprobados:0,
                    fecha_termino:'',
                    ultimo_acceso:fecha_actual,
                    primer_acceso:fecha_actual,
                    promedio:0,
                    id_materia:id_materia,
                    id_alumno:id_alumno
                }).then(res=>{
                    
                    $('#datos_materias').empty();
                    $('#datos_materias').append("<br><br><center><h4 class='text-danger'>El sistema esta procesando su solicitud <br>Por favor espere un momento.</h4></center><br><br>");
                

                    //alert('Se actualizo correctamente la materia');
                    actualizar_numero_temas(res.id,id_materia);
                    
                }).then(res=>{
                    //alert('Se actualizo correctamente la materia');
                    actualizar_temas_por_alumno(id_materia,id_alumno);
                    
                }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})

        } else {
            alert('La materia ya se encontraba almacenada');
            //location.reload(); 
        }

    });


    async function actualizar_numero_temas(materia,id_materia){
        console.log("actualizar temas: " +id_materia);
        var registros=0;

        firebase.firestore().collection('lessons').doc(id_materia).collection("Temas")
        .onSnapshot(res=>{
            res.forEach(fila=>{
                var datos= fila.data();
                registros=registros+1;
                console.log("aumentando registros: " + registros);
            });	 
            ////////////////////////////////////////
            console.log(registros)
            //registros=5;
            firebase.firestore().collection('students_lessons').doc(materia)
            .update({
                  numero_temas_materia:registros,
            }).then(res2=>{
                //location.reload(); 

            }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})

            ///////////////////////////////////////

        });
    }
    

    async function actualizar_temas_por_alumno(id_materia,id_alumno){
        console.log("actualizar temas: " +id_materia);
        var registros=0;
        var id_temas=[];
        var num_tema=[];
        var nombre_temas=[];
        var numero_cuestionarios=[];
        var posicion_temario=[];
        var porcentaje_materia=[];
        firebase.firestore().collection('lessons').doc(id_materia).collection("Temas")
        .onSnapshot(res=>{
            res.forEach(fila=>{
                var Id_tema=fila.id;
                console.log("UID tema"+Id_tema)
                var datos= fila.data();
                id_temas[registros]=Id_tema;
                num_tema[registros]=datos.num_tema;
                nombre_temas[registros]=datos.nombre;
                numero_cuestionarios[registros]=datos.num_cuestionarios;
                posicion_temario[registros]=datos.num_tema;
                porcentaje_materia[registros]=datos.porcentaje_materia;
                registros=registros+1;
                //console.log("aumentando registros: " + registros);
            });	

            var terminar_consultas=0;
            for (var i = 0; i < registros; i++) {
                ////////////////////////////////////////

                //console.log(id_temas[i])
                //console.log(nombre_temas[i])
                //console.log(numero_cuestionarios[i])
                //console.log(posicion_temario[i])
                //console.log(porcentaje_materia[i])

                terminar_consultas+=1;

                firebase.firestore().collection('students_topics')
                .add({
                    id_alumno:id_alumno,
                    id_materia:id_materia,
                    id_tema:id_temas[i],
                    nombre_tema:nombre_temas[i],
                    num_cuestionarios_tema:numero_cuestionarios[i],
                    posicion_temario:posicion_temario[i],
                    primer_acceso:fecha_actual,
                    ultimo_acceso:fecha_actual,
                    fecha_termino:"",
                    promedio:0,
                    num_cuestionarios_aprobados:0,
                    terminado:0,
                    num_tema: num_tema[i]


                }).then(function(){
                        //alert("entro despues del query")
                })
                ///////////////////////////////////////

            }

            setTimeout(function(){ alert("La materia fue agregada satisfatoriamente."); location.reload(); }, 5000);

            //alert("La materia fue agregada satisfatoriamente.")

            //location.reload();
        });

        

 
    }
    
   
    
    async function borrar(idMateria){
        
        idMateriaSeleccionda=idMateria;
        var mensaje="Registrando materia actual:  clave = " + idMateriaSeleccionda + " idAlumno= " +idAlumno ;
        //alert(mensaje)
        
  

    }

    async function borrarOK(){
        
        
        var mensaje="preparandose para borrar registros:  clave = " + idMateriaSeleccionda + " idAlumno= " +idAlumno ;
        //alert(mensaje)
        await borrar_materia_alumno();
       // await borrar_examenes_alumno();
       // await borrar_temas_alumno();
        
    }



    async function borrar_materia_alumno(){
  
        var mensaje="preparandose para borrar materia:  clave = " + idMateriaSeleccionda + " idAlumno= " +idAlumno ;
       // alert(mensaje)

       $('#datos_materias').empty();
       $('#datos_materias').append("<br><br><center><h4 class='text-danger'>Espere un momento, el sistema esta procesando su petición.</h4></center><br><br>");


        var jobskill_query = firebase.firestore().collection('students_lessons')
        .where('id_alumno','==',idAlumno)
        .where('id_materia','==',idMateriaSeleccionda);
        jobskill_query.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
                console.log("Borro Materia")
                
                
            });
        }).then(function(){
            console.log("preparandose para borrar tema")
            borrar_temas_alumno();
        }).then(function(){
            console.log("preparandose para borrar examenes")
            borrar_examenes_alumno();
        }).then(function(){
            console.log("Listo para recargar pagina")
            //alert("El registro fue borrado correctamente. ");
            //cargar_funciones();
            //datos_materias_alumnos();
            //location.reload();
            //window.history.back();
        
        }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})

        

    }

  
    async function borrar_temas_alumno(){        
        var mensaje="preparandose para borrar temas:  clave = " + idMateriaSeleccionda + " idAlumno= " +idAlumno ;
        //alert(mensaje)

        var jobskill_query = firebase.firestore().collection('students_topics')
        .where('id_alumno','==',idAlumno)
        .where('id_materia','==',idMateriaSeleccionda);
        jobskill_query.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
        });
        
    }

    async function borrar_examenes_alumno(){
        var mensaje="preparandose para borrar examenes:  clave = " + idMateriaSeleccionda + " idAlumno= " +idAlumno ;
       // alert(mensaje)

        var jobskill_query = firebase.firestore().collection('students-exams')
        .where('id_usuario','==',idAlumno)
        .where('id_materia','==',idMateriaSeleccionda);
        jobskill_query.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
            setTimeout(function(){ alert("La materia fue borrada satisfatoriamente."); location.reload(); }, 5000);

        });


        
    }

   
    
function toTimestamp(year,month,day,hour,minute,second){
    var datum = new Date(Date.UTC(year,month-1,day,hour,minute,second));
    return datum.getTime()/1000;
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
  

function mostrar_mensaje_error(codigo,mensaje){
    mensaje='Se presento el siguiente error: ' + codigo + mensaje ;
    console.log(mensaje)
}

