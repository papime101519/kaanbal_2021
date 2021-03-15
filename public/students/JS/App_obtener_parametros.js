
  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//Como llamarlos dentro del archivo
//  <script src="JS/App_obtener_parametros.js" ></script>
//var id_cuestionario= getParameterByName('id_cuestionario');
