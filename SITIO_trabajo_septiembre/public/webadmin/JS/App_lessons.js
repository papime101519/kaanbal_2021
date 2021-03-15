

$('#guardar').click(function(){
  var lessons={
    topic: ["Exponentes enteros",	"Exponentes fraccionarios","Operaciones fundamentales con exponentes","Definici&oacute;n de radicales","Propiedades radicales","Operaciones radicales","Simplificaci&oacute;n de radicales","Productos Notables: Cuadrado de un binomio","Productos Notables: Cuadrado de un trinomio","Productos Notables: Productos de binomios conjugados","Productos Notables: Producto de binomios que tienen t&eacute;rmino com&uacute;n","Productos Notables: Cubo de un binomio","Factorizaci&oacute;n de un trinomio cuadrado perfecto ","Factorizaci&oacute;n de diferencia de cuadrados","Factorizaci&oacute;n de expresiones con un factor com&uacute;n","Factorizaci&oacute;n de una diferencia de cubos"],
    nombre:"Antecedentes de &aacute;lgebra"
  }
  firebase.database().ref('lessons/AntecedentesAlgebra').set(lessons);  //modificar un usuario existente


  var lessons={
    topic: ["Funciones trigonom&eacute;tricas b&aacute;sicas","Teorema de Pit&aacute;goras","Ley del Seno"],
    nombre:"Trigonometria"
  }
  firebase.database().ref('lessons/Trigonometria').set(lessons);  //modificar un usuario existente

  console.log('Ejecuto guardar datos');

  });

