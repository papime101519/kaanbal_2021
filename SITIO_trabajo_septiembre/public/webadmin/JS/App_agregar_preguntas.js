$(document).ready(function(){
    combo_tipo_preguntas();
    
    
});  


$("#listado_tipo_preguntas").change(function(){

  tipo_seleccionado=$("#listado_tipo_preguntas").val();   
  redirigir_pregunta(tipo_seleccionado); 
});  



function combo_tipo_preguntas(){

    
  firebase.firestore().collection('typeQuestions')
	.onSnapshot(res=>{

		llenarTipoPreguntas(res);
	});

}

function llenarTipoPreguntas(res){
	res.forEach(rpta=>{
		var fila= rpta.data();
		//var KEY=rpta.id;
        var tipo_preguntas = fila.type;
        var i=0;
        tipo_preguntas.forEach(element => {
            $('#listado_tipo_preguntas').append("<option value='" +  i   + "' >" +  element  + "</option>");
            i=i+1;
        });
    
  });	
}


function redirigir_pregunta(tipo_seleccionado){

    console.log(tipo_seleccionado)
    if (tipo_seleccionado==0) { window.location.href = "agregar_preguntas_opcion_multiple.html"; }
    if (tipo_seleccionado==1) { window.location.href = "agregar_preguntas_calculada.html"; }
    if (tipo_seleccionado==2) { window.location.href = "agregar_preguntas_verdadero_falso.html"; }
  
  }