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
     error_reporting(0);
    $id_usuario= htmlspecialchars($_POST["id_usuario"]);
    echo "\n<script>";
    echo "\n var id_usuario='".$id_usuario. "';";
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

      <h3 align="center">Reporte por fecha</h3>
      <span id='titulo_reporte'></span>
      <span id='titulo_reporte2'></span>

    </div>

       <!-- Tables de datos-->

   
   <section class="tables" style=" padding-top: 5px; margin-top: 30px;" id="lista_datos">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="section-heading" >
            <h2></h2>
          </div>
          <div class="default-table" style=" padding-top: 0px;">
            <table>
              <thead>
                <tr>
                  <th></th>
                </tr>
              </thead>
              <tbody id='listado_materias'>   </tbody>
            </table>
          
  </section>
<!---++++++++++++++   tabla de datos     +++++++++++++++-->

    <!--********************************************************-->


            <!---++++++++++++++   FIN ZONA DE TRABAJO      +++++++++++++++-->
            

           


          </div>
        </div>



    </div>




  
   
            



    <div class="modal" tabindex="-1" id="borrar_preguntas">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Borrar Pregunta</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>Esta seguro de borrar el registro</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-primary" id="eliminar">Borrar</button>
            </div>
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
  <script src="JS/App_reporte_por_fecha_movil.js" ></script>

 

  </section>

</body>

</html>
