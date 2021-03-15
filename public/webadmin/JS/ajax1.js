$(document).on('ready',function(){ 
    $('#btn-ingresar').click(function(){
        var url = "datos_login.php";
        $.ajax({                        
           type: "POST",                 
           url: url,                     
           data: $("#formulario").serialize(), 
           success: function(data)             
           {
             $('#resp').html(data);               
           }
       });
    });

});