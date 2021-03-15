async function  actualizar_materias(id_usuario,id_materia){
    var id_temas=[];
    var calificaciones_maximas=[];
    var calificaciones_promedio=[];
    var temas_aprobados=[];
    var temas_reprobados=[];
    var id_materia_actualizar=0;
    var temas_por_materia=0;
    var terminado=0;
    var fecha_termino="";
    var contador_aprobados=0;
    var contador_reprobados=0;
    var valor_promedio;
    var valor_maximo;

   // alert("Alumno: " +id_usuario+ " id_materia " +id_materia)

    await firebase.firestore().collection("students_topics")
    .where("id_alumno", "==", id_usuario)
    .where("id_materia", "==", id_materia)
    .get()
    .then(function(res) {
        res.forEach(function(doc) {
            elemento=doc.data();
            id_temas.push(elemento.id_cuestionario)
            calificaciones_maximas.push(elemento.calificacion_maxima)
            calificaciones_promedio.push(elemento.promedio)
            temas_aprobados.push(elemento.temas_aprobados)
            temas_reprobados.push(elemento.temas_reprobados)
        });
    }).then(function(){
        n=id_temas.length;
        var j=0; 
        var contador=0;
        var maximo=0;
        var suma=0; 
        while  (j<n){
            //if(calificaciones_maximas[j]>=maximo){ maximo=calificaciones_maximas[j];}
            //if(calificaciones_promedio[j]>=6){ contador_aprobados+=1;} else {contador_reprobados+=1;}
            //suma=suma+calificaciones_promedio[j];
            if(calificaciones_maximas[j]>=6){ contador_aprobados+=1;} else {contador_reprobados+=1;}
            suma=suma+calificaciones_maximas[j];
            contador+=1;  
            j+=1;
        }
        valor_promedio=suma/contador;
        valor_maximo=maximo;

    })
    .catch(function(err) { mostrar_mensaje_error(err.code,err.message);});  
           
    //Se procesan los datos para luego crear un registro con los datos estadisticos del cuestionario
    var buscar_registro_materia_query = await firebase.firestore().collection('students_lessons')
        .where('id_alumno','==',id_usuario)
        .where('id_materia','==',id_materia);
    await buscar_registro_materia_query.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            //alert("entro a borrar registro "+ doc.id)
            id_materia_actualizar=doc.id;
            //alert("id_materia_actualizar "+id_materia_actualizar)
            temas_por_materia=doc.data().num_cuestionarios_tema;
        });      
    }).catch(function(err){mostrar_mensaje_error(err.code,err.message);  });
    
    

    //alert("Aprobados:  "+contador_aprobados+" Cuestionarios por tema: "+temas_por_materia)
    if(contador_aprobados>=temas_por_materia){ 
        terminado=1;
        fecha_termino=fecha_actual();
    } else{
        terminado=0;
        fecha_termino="";
    }

    //alert("Antes de guardar datos")
    console.log(
        "id_alumno: "+id_usuario+
        ",id_materia: "+ id_materia+
        ",id_tema: "+ id_tema+
        ",promedio: "+valor_promedio+
        ",temas_aprobados: "+contador_aprobados+
        ",temas_reprobados: "+contador_reprobados+
        ",terminado: "+terminado,
        ",fecha terminado: "+fecha_termino
    )

            
    await firebase.firestore().collection('students_lessons').doc(id_materia_actualizar)
    .update({
        promedio:valor_promedio,
        terminado:terminado,
        fecha_termino:fecha_termino,
        num_cuestionarios_aprobados:contador_aprobados,
        num_temas_reprobados:contador_reprobados

    }).then(res=>{
        //alert('Se actualizo correctamente la materia:  '+id_materia_actualizar );
    }).catch(err=>{ mostrar_mensaje_error(err.code,err.message);})
        
}

