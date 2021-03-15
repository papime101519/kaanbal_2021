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

    <style>
      .modal-dialog {
          min-height: calc(100vh - 20px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: auto;
          @media(max-width: 1000px) {
            min-height: calc(100vh - 10px);
          }
      }
    </style>


    <!-- Additional CSS Files -->
    <link rel="stylesheet" href="../assets/css/fontawesome.css">
    <link rel="stylesheet" href="../assets/css/templatemo-style.css">
    <link rel="stylesheet" href="../assets/css/owl.css">

    <title>Desarrollo de Aplicaciones M&oacute;viles para apoyar el aprendizaje  de la materia de &aacute;lgebra.</title>
    

    <?php

    error_reporting(0);
    $idAlumno= htmlspecialchars($_POST["id_usuario"]);
    echo "\n<script>";
    echo "\n var idAlumno='".$idAlumno. "';";
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

   <!-- Tables -->
   <section class="tables" style=" padding-top: 5px; margin-top: 30px;" id="lista_materias">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="section-heading" >
            <h2>Mis materias</h2>
          </div>
          <div class="default-table" style=" padding-top: 0px;">
            <table>
              <thead>
                <tr>
                  <th>Materia</th>
                  <th></th>
                 
                </tr>
              </thead>
              <tbody id='datos_materias'>   </tbody>
            </table>

            <div class="container-fluid row  ">
                  <form class="col-12">
                    <button type="button" class="btn btn-dark col-12" data-toggle="modal" data-target="#abrir_agregar_materias">
                      Agregar materia
                    </button>  
                  </form>
            </div>

  </section>

 




            <!---++++++++++++++   FIN ZONA DE TRABAJO      +++++++++++++++-->
            

           


          </div>
        </div>



    <div class="modal" tabindex="-1" id="abrir_agregar_materias"   >
      <div class="modal-dialog" >
        <div class="modal-content" >
          <div class="modal-header">
            <h5 class="modal-title">Agregar materias</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="mostrarDatosMaterias" id="mostrarDatosMaterias">   
              <br/>
                <form id="datos_materias" action="" method="post">
                        <div class="col-md-12">
                          <label for="cars">Seleccione la materia que desea agregar:</label>
                          <select  id="combo_materias" ></select>
                          <br><br>
                        </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal" id="salvar_agregar_materia">Salvar cambios</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
          </form>
          </div>
        </div>
      </div>
    </div>


    <div class="modal" tabindex="-1" id="borrar_materias">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Borrar Materia</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Esta seguro de borrar la materia, Al realizar esta accción perderá todos sus avances</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="eliminar" data-dismiss="modal" onclick="borrarOK()">Borrar</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>

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
<script src="JS/App_ver_materias_alumno_movil.js" ></script>

  </section>

</body>

</html>
