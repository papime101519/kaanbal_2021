async function combo_materias(){
    var consulta= await firebase.firestore().collection('lessons').get()
    .then(res=>{
        $('#materias').empty();
        i=1;
        res.forEach(rpta=>{
            var fila= rpta.data();
            var KEY=rpta.id;
            var nombre = fila.nombre;
            if (i==1){ seleccionado='selected'} else {seleccionado=''}
            $('#materias').append("<option value='" +  KEY   + "' " + seleccionado + " >" +  nombre  + "</option>");
            i=i+1;
        });
        $("#materias").change();
    }).catch(err=>{
        //console.log('Ocurrio un error');
   
   })
       
}




async function combo_temas(materia_seleccionada){  
    var consulta= await firebase.firestore().collection('lessons').doc(materia_seleccionada).collection('Temas').get().then(res=>{
        $('#temas').empty();
        i=0;
        res.forEach(elemento => {
            //console.log(i)
            clave=elemento.id;
            nombre=elemento.data().nombre;
            if (i==0){ seleccionado='selected'} else {seleccionado=''}
            $('#temas').append("<option value='" +  clave   + "' " + seleccionado + " >" +  nombre  + "</option>");
            i=i+1;
        });
        $("#temas").change();
        
    }).catch(err=>{
         //console.log('Ocurrio un error');
    
    }); 


}
