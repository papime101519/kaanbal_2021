  $(document).ready(function(){
    listado_alumnos3();
});

function listado_alumnos2(){
	firebase.firestore().collection('TipoLibro').where('habilitado','==','1')
	.onSnapshot(res=>{
		listarTipoLibro(res);
	});
}

function listado_alumnos3(){
	firebase.firestore().collection('students')
	.onSnapshot(res=>{
		llenarMaterias(res);
	});
}

function listarTipoLibro(res){

	res.forEach(rpta=>{
		var fila= rpta.data();
		var KEY=rpta.id;
		var nombre = fila.nombre;
		var descripcion=fila.descripcion;
		var habilitado=fila.habilitado;
		$('#datos_alumnos').append("<tr><td>" +  nombre   + "</td><td>" +  descripcion  + "</td><td>" +  habilitado  + "</td></tr>");
	});
	
};

function llenarMaterias(res){
	res.forEach(rpta=>{
		var fila= rpta.data();
		var KEY=rpta.id;
		var nombre = fila.nombre;
		var descripcion=fila.e_mail;
		var habilitado=fila.numCuenta;
		$('#datos_alumnos').append("<tr><td>" +  nombre   + "</td><td>" +  descripcion  + "</td><td>" +  habilitado  + "</td></tr>");
	});	
}


function listado_alumnos(){

    var db=firebase.database();
    var ref=db.ref('students');
    
    ref.orderByChild("nombre").on("child_added", function(snapshot) {
    //ref.orderByChild("numCuenta").equalTo("041123558").on("child_added", function(snapshot) {

          var KEY=snapshot.key;
          var nombre = snapshot.val().nombre;
          var email =snapshot.val().email;
          var numCuenta=snapshot.val().numCuenta;
          
          $('#datos_alumnos').append("<tr><td>" +  numCuenta   + "</td><td>" +  nombre  + "</td><td>" +  email  + "</td></tr>");


    });
}

$("#listado_alumnos").click(function(){
  var db=firebase.database();
  var ref=db.ref('students');

  ref.orderByChild("nombre").on("child_added", function(snapshot) {
         var KEY=snapshot.key;
         var nombre = snapshot.val().nombre;
         var email =snapshot.val().email;
         var numCuenta=snapshot.val().numCuenta;
        $('#listado_alumnos').append("<option value='" +  numCuenta   + "' >" +  nombre  + "</option>");
  });

});