<!DOCTYPE html>
<html lang="en">

  <head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Pagina Web">
    <meta name="author" content="PaginaWeb">
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700" rel="stylesheet">

 

    <!-- Bootstrap core CSS -->
    <link href="../vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">



    <!-- Additional CSS Files -->
    <link rel="stylesheet" href="../assets/css/fontawesome.css">
    <link rel="stylesheet" href="../assets/css/templatemo-style.css">
    <link rel="stylesheet" href="../assets/css/owl.css">

    <title>Desarrollo de Aplicaciones M&oacute;viles para apoyar el aprendizaje  de la materia de &aacute;lgebra.</title>
    
<?php



$id_usuario= htmlspecialchars($_POST["id_usuario"]);
$id_cuestionario= htmlspecialchars($_POST["id_cuestionario"]);
$id_materia= htmlspecialchars($_POST["id_materia"]);
$id_tema= htmlspecialchars($_POST["id_tema"]);
//$nombre_tema= htmlspecialchars($_POST["nombre_tema"]);


echo "\n<script>";
echo "\n var id_usuario='".$id_usuario. "';";
echo "\n var id_materia='".$id_materia. "';";
echo "\n var id_tema='".$id_tema. "';";
echo "\n var id_cuestionario='".$id_cuestionario. "';";

//echo "\n var nombre_tema='".$nombre_tema."';";

echo "\n</script>";


?>

  </head>

<body class="is-preload" >

    <!-- Wrapper -->
    <div id="wrapper">

      <!-- Main -->
        <div id="main">
          <div class="inner">




            <!---++++++++++++++   ZONA DE TRABAJO      ++++++++++++++++++-->

    <!-- ***********CUERPO EDITABLE PAGINA ********************-->
    <div class="container">

      <h3 align="center" id="titulo_materia"></h3>
     <br>       
    </div>


       <!-- Tables de datos-->

   
   <section class="tables" style=" padding-top: 5px; margin-top: 30px;" id="lista_preguntas">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="section-heading" >
            <h2 id="titulo_pagina"></h2>
          </div>
          <div class="default-table" style=" padding-top: 0px;">
            <table>
              <thead>
                <tr>
                </tr>
              </thead>
              <tbody id='listado_cuestionarios'>   </tbody>
            </table>

          <div class="row">
              <div class="col-12">
                  <button  class="btn btn-block btn-info" id="enviar" name="enviar" onclick="salvar_datos();">Salvar datos</button>
                  
                </div>
          </div>
           
  </section>



  <!---------------VENTANA MODAL---------------->

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Resultado final</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="cerrar_cuestionario()" >Cerrar</button>
        
      </div>
    </div>
  </div>
</div>
  <!--------------FIN DE VENTANA MODAL---------->

<!---++++++++++++++   tabla de datos     +++++++++++++++-->

    <!--********************************************************-->


            <!---++++++++++++++   FIN ZONA DE TRABAJO      +++++++++++++++-->
            

           


          </div>
        </div>



    </div>

    
  <section id="zona_scripts">
    <!-- Scripts -->
    <!-- Bootstrap core JavaScript -->
      <script src="../vendor/jquery/jquery.min.js"></script>
      <script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  
      <script src="../assets/js/browser.min.js"></script>
      <script src="../assets/js/breakpoints.min.js"></script>
      <script src="../assets/js/transition.js"></script>
      <script src="../assets/js/owl-carousel.js"></script>
      <script src="../assets/js/custom.js"></script>
  
  <!-- The core Firebase JS SDK is always required and must be listed first -->
  <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js"></script>
  
  <!-- TODO: Add SDKs for Firebase products that you want to use
       https://firebase.google.com/docs/web/setup#available-libraries -->
  <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-analytics.js"></script>
  
  
  <!-- SE AGREGO COMO UNA LIBRERIA EXTRA,PORQUE NO ESTA CARGADA INICIALMENTE  -->
  <script src="https://www.gstatic.com/firebasejs/7.8.1//firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/7.8.1//firebase.js"></script>
  
  
  <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-firestore.js"></script>
  
  
  <script src="JS/configuracion_firebase.js" ></script>
  <script src="JS/App_mostrar_cuestionario_movil.js" ></script>


  </section>

</body>

</html>
