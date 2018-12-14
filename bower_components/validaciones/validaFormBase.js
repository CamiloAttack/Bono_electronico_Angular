function validaRut(rutCompleto) {
    if (!/^[0-9]+-[0-9kK]{1}$/.test( rutCompleto ))
        return false;
    var tmp     = rutCompleto.split('-');
    var digv    = tmp[1]; 
    var rut     = tmp[0];
    if ( digv == 'K' ) digv = 'k' ;
    return (dv(rut) == digv );
}

function dv(T){
    var M=0,S=1;
    for(;T;T=Math.floor(T/10))
        S=(S+T%10*(9-M++%6))%11;
    return S?S-1:'k';
}
 

 

function swichTipoDato(tipo_campo,valor_campo,id_campo,accion){

  var fontSize = 12;
  var alto = $("#"+id_campo).height(); // valor pensado si un area text es mas alto  <span class='tooltip_error' style="'+alto+'">Dato necesario</span>

  switch (tipo_campo) { // switch para validar el tipo de pago con respectivos campos


        case 'rut_unico':
        {                
       
          if (valor_campo == ""){
             
            $("#"+id_campo).addClass("error"); 
            $("#"+id_campo).next().remove();
           $("#"+id_campo).after("<span class='tooltip_error'>Dato necesario</span>" );      

            return 

          }else  if ( !validaRut( valor_campo ) && accion == 'agregar' ){
    
              $("#"+id_campo).addClass("error"); 
              $("#"+id_campo).next().remove();
              $("#"+id_campo).after("<span class='tooltip_error'>Rut Invalido</span>" );
                
          }else{

             var data = { rut_paciente : valor_campo,accion: 'consultarRut' };

            $.get("/financiador/utilidades",data,function(respuesta){
                  $("#"+id_campo).removeClass("error");  

              if(respuesta == true && accion == 'agregar'){ 
              
                $("#"+id_campo).addClass("error"); 
                $("#"+id_campo).next().remove();  

                $("#"+id_campo).after("<span class='tooltip_error'>El Rut ya existe</span>" );

                return false

              }else{

     
       
                $("#"+id_campo).removeClass("error"); 
                $("#"+id_campo).next().remove();

                return true                    
              }
                        
            });
          } 

          break
        }// fin rut


        case 'rut':
        {
          var alto = $("#"+id_campo).height();
          if (valor_campo == ""){
            $("#"+id_campo).addClass("error"); 
            $("#"+id_campo).next().remove();
           $("#"+id_campo).after("<span class='tooltip_error'>Dato necesario</span>" );      

            return 

          }else  if ( !validaRut( valor_campo ) && accion == 'agregar'){
             $("#"+id_campo).addClass("error"); 
              $("#"+id_campo).next().remove();
              $("#"+id_campo).after("<span class='tooltip_error'>Rut Invalido</span>" );

              return 
                
          }else{


            $("#"+id_campo).removeClass("error"); 
            $("#"+id_campo).next().remove();
              
          }

          break

        }// fin rut


        case 'string':
        {

        {

          if (valor_campo == ""){

            $("#"+id_campo).addClass("error"); 

            $("#"+id_campo).next().text("Dato necesario");
     
              return false

            }else{

              $("#"+id_campo).next().text("");
              $("#"+id_campo).removeClass("error"); 
            }

          break;
        }

          break;
        }
 
 
        case 'num':
        {
     
          if (valor_campo == ""){

            $("#"+id_campo).addClass("error"); 
            $("#"+id_campo).next().text("Dato necesario");   
            return false

          }else if (isNaN(valor_campo) || valor_campo.length <= 8){  
       
            $("#"+id_campo).addClass("error"); 
            $("#"+id_campo).next().text("Valor debe ser N° de 9 digitos");


          
          return false
                  
          
          }else{

            $("#"+id_campo).next().text("");
            $("#"+id_campo).removeClass("error");            
              
          }

          break;

        }

        case 'opcion_select':
        {
          var alto = $("#"+id_campo).height();
          if (valor_campo < 0){

                $("#"+id_campo).next().remove();
                $("#"+id_campo).after("<span class='tooltip_error'>Dato necesario</span>" );      
                $("#"+id_campo).addClass("error");   
             return

          }

            $("#"+id_campo).siblings("span").remove();
            $("#"+id_campo).removeClass("error");      

          break;

        }
  
        case 'mail' :
        {
          var alto = $("#"+id_campo).height();
          var exp_reg_mail = /[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;


          if (valor_campo == ""){

            $("#"+id_campo).addClass("error"); 
            $("#"+id_campo).next().text("Dato necesario");
           //$("#"+id_campo).after("<span class='tooltip_error'>Dato necesario</span>" );      

            return false

          }else if(!exp_reg_mail.test(valor_campo))

          {  
            $("#"+id_campo).addClass("error");    
          //  $("#"+id_campo).next().remove();
          //  $("#"+id_campo).after("<span class='tooltip_error'>Mail incorrecto</span>" );  
              $("#"+id_campo).next().text("Mail incorrecto");

              return false

          }else{

              $("#"+id_campo).next().text("");
              $("#"+id_campo).removeClass("error");
          }      

          break;

        }

      }


}


function valida_form(){

    $(".campo_validado").each(function(k,v){

      var tipo_campo = $(this).attr("data-tipoCampo");
      var id_campo = $(this).attr("id");
      var valor_campo = $("#"+id_campo).val(); 

      swichTipoDato(tipo_campo,valor_campo,id_campo);
    

    });


    $( ".campo_validado" ).keyup(function( event ) {

      var tipo_campo = $(this).attr("data-tipoCampo");
      var id_campo = $(this).attr("id");
      var valor_campo = $("#"+id_campo).val();  
      var name_input = $("#"+id_campo).attr("name");

      swichTipoDato(tipo_campo,valor_campo,id_campo);
       
     });// FIN 

    $( ".campo_validado").on('change',function(){

        var tipo_campo = $(this).attr("data-tipoCampo");
        var id_campo = $(this).attr("id");
        var valor_campo = $("#"+id_campo).val();  
        var name_input = $("#"+id_campo).attr("name");

         swichTipoDato(tipo_campo,valor_campo,id_campo);
    });


}