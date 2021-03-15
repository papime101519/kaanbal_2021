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
$id_materia= htmlspecialchars($_POST["id_materia"]);
//$nombre_materia= htmlspecialchars($_POST["nombre_materia"]);


echo "\n<script>";
echo "\n var id_usuario='".$id_usuario. "';";
echo "\n var id_materia='".$id_materia. "';";
//echo "\n var nombre_materia='".$nombre_materia."';";

echo "\n</script>";


?>
  </head>

<body class="is-preload" >

    <!-- Wrapper -->
    <div id="wrapper">

      <!-- Main -->
        <div id="main">
          <div class="inner">

            <!-- Header -->



            <!---++++++++++++++   ZONA DE TRABAJO      ++++++++++++++++++-->

    <!-- ***********CUERPO EDITABLE PAGINA ********************-->
    <div class="container">

      <h3 align="center" id="titulo_tema">Seleccione el tema que desea revisar</h3>
   
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
              <tbody id='listado_temas' > <span class="text-danger">Seleccione el tema que desea borrar su avance:</span>  </tbody>
            </table>


  
          
  </section>
<!---++++++++++++++   tabla de datos     +++++++++++++++-->

    <!--********************************************************-->


            <!---++++++++++++++   FIN ZONA DE TRABAJO      +++++++++++++++-->
            

           


          </div>
        </div>

      <!-- Sidebar -->
 

    </div>




  
   
            



    <div class="modal" tabindex="-1" id="ventana_borrar_temas">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Borrar avance por tema</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="cerrar_modal(); " >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>Esta seguro de borrar el registro</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="cerrar_modal();">Cerrar</button>
              <button type="button" class="btn btn-primary" id="eliminar" onclick= "borrar_tema()">Borrar</button>
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
  <script src="JS/App_borrar_listado_por_tema_movil.js" ></script>


  </section>

</body>

</html>
