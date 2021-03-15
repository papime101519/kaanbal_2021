
$('#guardar').click(function(){

var grupo={
    description:"Grupo1",
    lesson:"lessons/AntecedentesAlgebra",
    teacher:"teachers/-M-qbx42D4SucqQMc4iy"

};


firebase.database().ref('groups').push(grupo);   
console.log('Ejecuto despues de  presionar el boton de guardar');



var grupo={
    description:"Grupo2",
    lesson:"lessons/AntecedentesAlgebra",
    teacher:"/teachers/-M-qbx44t61w_fLjJGIy"
};
firebase.database().ref('groups').push(grupo);   
console.log('Ejecuto despues de  presionar el boton de guardar');
    



var grupo={
    description:"Grupo3",
    lesson:"lessons/AntecedentesAlgebra",
    teacher:"/teachers/-M-qbx45WkzjKhxb34pz/"
};
firebase.database().ref('groups').push(grupo);   
console.log('Ejecuto despues de  presionar el boton de guardar');
     
      
        


});




