        var currentStep = "step_bcscanner";
     
        function funcionCodigoLeido(message) {
          //  alert();
           

            stepsToggleClass( $('#step_bcscanner') , 'completed' );
            stepsToggleClass( $('#step_fpscanner') , 'active' );
            stepsToggleClass( $('#step_verif') , '' );

            var objectNotificacionCodigoLeido = $.parseJSON(message);

            console.log("funcionCodigoLeido");
            console.log(objectNotificacionCodigoLeido);

   
                var hash = location.hash; 
                var  operadorOpaciente = "SUPERVISOR";

                switch(hash){

                    case "#/identificacion-usuario":

                        operadorOpaciente = "OPERADOR";

                    break;

                    case "#/identificacion-paciente/ram":

                        operadorOpaciente = "PACIENTE"; 

                    break;    

                }

 


                console.log("funcionCodigoLeido");
                console.log(objectNotificacionCodigoLeido);

                if( !objectNotificacionCodigoLeido.estado )
                {
                    //return alert(objectNotificacionCodigoLeido.mensaje.mensaje_usuario);
                    notificar('error', objectNotificacionCodigoLeido.mensaje.mensaje_usuario);
                }

                $("#id_rut_nuevoOantiguo").text("nuevo");

                     //   $("#mensaje_exito").text( operadorOpaciente+ " IDENTIFICADO CON EXITO");
                    


                var  apeBene = objectNotificacionCodigoLeido.extra.apellidos;
                var  nombreBene = objectNotificacionCodigoLeido.extra.nombres; 
                var  rut = objectNotificacionCodigoLeido.extra.rut;
                var  numero;
                var  rut_nuevoOantiguo = "nuevo";

                var  nombre_ape = apeBene+" "+ nombreBene;


                if(!nombreBene){

                    nombre_ape = apeBene;
                }

                if(!nombreBene){

                    rut_nuevoOantiguo = "antiguo";

                }

                $("#id_rut_nuevoOantiguo").text(rut_nuevoOantiguo);

                /*if( rut.length ==  9 ){

                    numero = rut.substr(0,8);

                    }else{

                    numero = rut.substr(0,7);
                }*/
 
               // var dv = rut.slice(-1); 

                $("#id_rut_apertura_caja").html(rut); 
                $("#campo_texto_rut-paciente").val(rut);  
                $("#campo_texto_rut_supervisor").val(rut);                  
                $("#nombre_login").html(nombreBene);
                $("#apellido_login").html(apeBene);
                    
                $("#accionEnToc").text("COLOCA EL DEDO INDICE DEL "+operadorOpaciente + " SOBRE EL TOC");
                $("#accionEnTocDesbloquear").text("COLOCA EL DEDO INDICE  SOBRE EL TOC");
                $("#mensaje_exito").text(operadorOpaciente + " : " + nombre_ape + " , " + rut);
                $("#mensaje_exitoDesbloquear").text("OPERADOR" + " : " + nombre_ape + " , " + rut);
                $.each( objectNotificacionCodigoLeido.extra, function( key, val){

                    if( key === "vencida" ){
                        // False => No se encuentra vencida
                        $('#scanned_vencimiento').addClass( ( val === "False" ? "" : "cedulaVencida" ) );
                    }
                    else if( key === "dedo" ){

                        $('#fingersToScan').empty().html(val);

                    }
                    else{

                        $( '#scanned_' + key ).val(val);
     
                    }
                });

    

        };
        
        function funcionHuellaLeida(message) {
        
            stepsToggleClass( $('#step_fpscanner') , 'completed' );
            stepsToggleClass( $('#step_verif') , 'active' );

            var objectNotificacionHuellaLeida = $.parseJSON(message);

            console.log("funcionHuellaLeida");
            console.log(objectNotificacionHuellaLeida);

            if( !objectNotificacionHuellaLeida.estado )
            {
                //return alert(objectNotificacionHuellaLeida.mensaje.mensaje_usuario);
                notificar('error', objectNotificacionHuellaLeida.mensaje.mensaje_usuario);
            }

            $('#fingersToScanImage').attr('src', 'data:image/png;base64,' + objectNotificacionHuellaLeida.extra.imagen);

            $('#verificationIcon').attr('src', 'img/spinner.gif');

        };

        function funcionVerificado(message) {

            var hash = location.hash; 
            stepsToggleClass( $('#step_verif') , 'completed' );
            var objectNotificacionVerificado = $.parseJSON(message);

            console.log("funcionVerificado");
            console.log(objectNotificacionVerificado.estado);

            if(!objectNotificacionVerificado.estado)
            {
                
               // $('#verificationIcon').attr('src', 'img/reintentar.png');  esto es del demo toc original
                $("#accionEnTocDesbloquear").text("LA HUELLA NO COINCIDE");  
                $("#accionEnToc").text("LA HUELLA NO COINCIDE");   

            } 
            else
            {
                if(objectNotificacionVerificado.extra.verificacion === "1")
                {
                   // $('#verificationIcon').attr('src', 'img/positivo.png'); esto es del demo toc original

                    var  operadorOpaciente = "OPERADOR";


                    var hash = location.hash;     
            
                    switch(hash){
                        case "#/identificacion-usuario":

                            $("#id_boton_login").click();

                        break;

                        case "#/identificacion-paciente/ram":

                            operadorOpaciente = "PACIENTE";
                      
                            $("#id_boton_login").click();    

                        break;

                        case "#/consulta-venta":

                            if($(".modal-titulo").text() == "ANULAR BONO"){

                                operadorOpaciente = "SUPERVISOR";
                                $("#id_boton_login").click();


                            }else{

                                $("#id_boton_login").click();                                    

                            }
                         
                        
                        break;
                        case "#/menu":                            

                            $("#id_boton_login").click();   
                        
                        break;
                        
                        case "#/ramsimulacion":

                            $("#id_boton_login").click();   
                        
                        break;


                        case "#/ram":

                            $("#id_boton_login").click();   
                        
                        break; 

                        case "#/ram/pago":

                            $("#id_boton_login").click();   
                        
                        break; 

                        case "#/ram/confirmacion":

                            $("#id_boton_login").click();   
                        
                        break; 


                        case "#/cierre-caja":

                            $("#id_boton_login").click();   
                        
                        break; 


                        case "#/detalle-caja-medio-pago":

                            if($(".modal-titulo").text() == "ANULAR BONO"){

                               operadorOpaciente = "SUPERVISOR";
                                $("#id_boton_login").click();


                            }else{

                                $("#id_boton_login").click();                                    

                            }
                        
                        break;                             

                        
                        default: // supervisor

                            $("#accionEnTocDesbloquear").text("SUPERVISOR IDENTIFICADO CON EXITO");
                                                             


                    }

   
                    $("#mensaje_exito").text( operadorOpaciente+ " IDENTIFICADO CON EXITO");

                    $("#accionEnTocDesbloquear").text("");
                    $("#accionEnToc").text("");   
                    disconnect();                 
                    /*
                    if(hash == "#/identificacion-usuario"){

                        $("#mensaje_exito").text( operadorOpaciente+ " IDENTIFICADO CON EXITO");
                        $("#id_boton_login").click();

                    }
                    else if(hash == "#/identificacion-paciente/ram"){

                        $("#mensaje_exito").text( operadorOpaciente+ " IDENTIFICADO CON EXITO");
                        $("#id_boton_login").attr("disabled",false);

                    }else{

                        $("#mensaje_exito").text("");//supervisor
                        $("#accionEnTocDesbloquear").text("COLOCA EL RUT DEL SUPERVISOR SOBRE EL TOC");
                        $("#id_boton_login").click(); 

                    }*/


                }
                else
                {
                    $('#verificationIcon').attr('src', 'img/negativo.png');
                }
            }
        }
        
        function funcionError(message) {

            var objectNotificacionError = $.parseJSON(message);

            console.log("funcionError");
            console.log(objectNotificacionError.mensaje.mensaje_usuario);
            if(objectNotificacionError.mensaje.mensaje_usuario == "Time out" || objectNotificacionError.mensaje.mensaje_usuario =="Nueva CI no detectada en lector de tarjetas. CHIP de cédula defectuoso no se puede operar con TOC"){

                setTimeout(function(){

                    disconnect();
                    connect(0);   

                },4000);

            }

            //alert(objectNotificacionError.mensaje.mensaje_usuario);
            notificar('error', objectNotificacionError.mensaje.mensaje_usuario);
        };

        function funcionInformativo(message) {
        

                var objectNotificacionInformativo = $.parseJSON(message);

                console.log("funcionInformativo");
                console.log(objectNotificacionInformativo.mensaje.mensaje_usuario);

                if(objectNotificacionInformativo.mensaje.mensaje_usuario == "Se ha leido el código con éxito, favor posicione la cádula en lector NFC"){

                    objectNotificacionInformativo.mensaje.mensaje_usuario = "Se ha leido el código con éxito, favor mantenga la cédula en lector NFC"
                }

                notificar('success', objectNotificacionInformativo.mensaje.mensaje_usuario);

        }

        function stepsToggleClass( stepReference, classToAssign )
        {
            var classes = ['active', 'completed', 'danger'];
            stepReference.removeClass( classes.join(' ') );
            stepReference.addClass(classToAssign);
        }

         

        $('#connect').click(function(e){
            e.preventDefault();
            connect(0);
        });

        $('#disconnect').click(function(e){
            e.preventDefault();
            disconnect();
        });

                         
        $('#re_connect').click(function(e){
            e.preventDefault();
            disconnect();
            connect(0);            
        });
               
        
        $(function(){
            connect(0);
            stepsToggleClass( $('#step_bcscanner') , 'active' );
        });

        function connect(_acto)
        {
            console.log("connect executed with act " + _acto);
            TOC.exec(_acto, {
                "notificacionCodigoLeido"           : "funcionCodigoLeido",
                "notificacionHuellaLeida"           : "funcionHuellaLeida",
                "notificacionVerificado"            : "funcionVerificado",
                "notificacionError"                 : "funcionError",
                "notificacionFotografiaObtenida"    : "funcionFotografiaObtenida",
                "notificacionInformativo"           : "funcionInformativo"
            });
        }

        function disconnect()
        {
            console.log("disconnect executed");
            TOC.disconnect();
        }

        function getid()
        {
            var id = TOC.getid();
            console.log( "mi id = " + id );
        }

        function notificar(tipo, mensaje)
        {
            $.toast({
                text: mensaje,
                showHideTransition: 'fade',
                position: 'top-center',
                hideAfter: 5000,
                icon: tipo
            });
        }
// }