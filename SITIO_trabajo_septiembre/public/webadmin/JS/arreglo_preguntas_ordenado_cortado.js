var arreglo_preguntas = ["Guillermo", "Lucas", "David", "Roger", "Bruno", "Iñaki", "Alex", "Carlos"];


arreglo_preguntas=arreglo_aleatorio_cortado(arreglo_preguntas,8);
console.log(arreglo_preguntas)

function arreglo_aleatorio_cortado(arreglo_datos,numero_registros){
    var arreglo_preguntas=arreglo_datos;
    var Total = arreglo_preguntas.length;
    var arreglo_ordenado=[];
    for (i=0; i<Total; i++) {
        aleatorio = Math.floor(Math.random()*(arreglo_preguntas.length));
        seleccion = arreglo_preguntas[aleatorio];
        arreglo_ordenado.push(seleccion)
        //console.log(seleccion);
        arreglo_preguntas.splice(aleatorio, 1);
       // console.log(arreglo_preguntas)
    }
    
    //console.log(arreglo_ordenado);
    arreglo_preguntas=arreglo_ordenado.splice(0,numero_registros);
    //console.log(arreglo_preguntas)
    return arreglo_preguntas;
}