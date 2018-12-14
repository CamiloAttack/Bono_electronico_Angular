

//'use strict';

/**
 * @ngdoc service
 * @name medipassBE.servicioMilliways
 * @description
 * # servicioMilliways
 * Service in the medipassBE.
 */
angular.module('medipassBE')
  .service('servicioMilliways', function ($stateParams,$state,servicioLocal,$timeout,$localStorage) {

    var  vm = this;
    vm.servicioLocal = servicioLocal;
    vm.atencion = servicioLocal.atencion;
    vm.datosSesion = servicioLocal.datosSesion;      
    vm.$state = $state;
    vm.$stateParams = $stateParams; 
    vm.datosMensaje = servicioLocal.datosMensaje;
    vm.tipoAtenciones = servicioLocal.tipoAtenciones; 
    
  
    var url = "http://"+vm.servicioLocal.subDominio.valor+".xxxxxx.cl/bono4/medipass_v1";
  
    var incremento = 0;
    this.consultaAtencion = function(){

      var pl = new SOAPClientParameters();

            pl.add("urn:offset", "0");
            pl.add("urn:length", "1000");
            pl.add("urn:idRazonSocial", vm.datosSesion.idRazonSocialSucursal);
            pl.add("urn:idSucursal",vm.datosSesion.sucursalId);
            pl.add("urn:idLugarAtencion",vm.datosSesion.lugarAtencionId);

 

            SOAPClient.invoke(url, "consultaAtencion", pl, true,callBackConsultaAtencion);    
    };

    function callBackConsultaAtencion(u){

     
      var cargaDatos = {};
      var cargaDatos2 = [];

      var cargaDatosExcel = [];
      var cargaDatosExcel2 = [];
      var valor_disabled;


      $.each(u,function(k,v){ 

        k + 1;
        var str = v["ns:nombreTipoAtencion"];
        var res = str.split("_");

 
  
        valor_disabled = res[1] == 7 ? true : false;
        valor_clase = res[1] == 7 ? 'roj-roj' : 'gri-gri';

       cargaDatos2 = { 
                      idAtencion:v["ns:idAtencion"],
                      disabled : valor_disabled,
                      fechaHoraBono : v["ns:fechaHoraBono"],
                      valor_clase : valor_clase,
                      fecha_bono_unix :  moment(v["ns:fechaHoraBono"]).unix(),
                      estadoAtencionId : res[1],

                      planGrupo : v["ns:planGrupo"],
                      numeroBono : v["ns:numeroBono"],
                      montoIsapres : v["ns:montoIsapres"],
                      montoSeguro : v["ns:montoSeguro"],
                      montoCaja : v["ns:montoCaja"],
                      totalBonif : v["ns:totalBonif"],
                      totalPresta : v["ns:totalPresta"],
                      copago : v["ns:copago"],
                      usoExcedente : v["ns:usoExcedente"],

                      rutAfiliado : v["ns:rutAfiliado"]["ns:numero"]+"-"+v["ns:rutAfiliado"]["ns:dv"],
                       
                      nombreAfiliado : v["ns:nombreAfiliado"],
                      apellidoAfiliado : v["ns:apellidoAfiliado"],
                      rutBeneficiario : v["ns:rutBeneficiario"]["ns:numero"]+"-"+v["ns:rutBeneficiario"]["ns:dv"],

                      nombreBeneficiario : v["ns:nombreBeneficiario"],
                      codigoAtencion : v["ns:codigoAtencion"],
                      idEstatus : v["ns:idEstatus"],
                      idRazonSocial : v["ns:idRazonSocial"],
                      rutRazonsocial : v["ns:rutRazonsocial"]["ns:numero"]+"-"+v["ns:rutRazonsocial"]["ns:dv"],
                       

                      nombreFantasia : v["ns:nombreFantasia"],
                      nombreRazonsocial : v["ns:nombreRazonsocial"],

                      nombreLugaratencion : v["ns:nombreLugaratencion"],

                      nombreSucursal : v["ns:nombreSucursal"],

                      tipoAtencionId : v["ns:tipoAtencionId"],

                      nombreTipoAtencion : res[0],

                      nombreMedico : v["ns:nombreMedico"],

                      rutMedico : v["ns:rutMedico"]["ns:numero"]+"-"+v["ns:rutMedico"]["ns:dv"],
                       
                      isapre : v["ns:isapre"],

                      seguro : v["ns:seguro"],

                      caja : v["ns:caja"],                                   

                    };
             
       cargaDatosExcel = [
                      v["ns:idAtencion"], 
                      v["ns:nombreSucursal"],
                      v["ns:nombreLugaratencion"], 

                      v["ns:tipoAtencionId"], 
                      v["ns:numeroBono"],
                      v["ns:codigoAtencion"],
                     v["ns:fechaHoraBono"],                         
                      v["ns:rutBeneficiario"]["ns:numero"]+"-"+v["ns:rutBeneficiario"]["ns:dv"],                      

                      v["ns:nombreBeneficiario"],
                      v["ns:rutMedico"]["ns:numero"]+"-"+v["ns:rutMedico"]["ns:dv"],    
                      v["ns:nombreMedico"],   
                      v["ns:isapre"],

                      v["ns:montoIsapres"],
                      v["ns:seguro"],                      
                      v["ns:montoSeguro"],
                      v["ns:caja"],                       
                      v["ns:montoCaja"],

                      v["ns:totalBonif"],
                      v["ns:totalPresta"],
                      v["ns:copago"],  


                    ]

          vm.servicioLocal.consultaVentasExcel[k] = cargaDatosExcel;

          cargaDatos[k] = cargaDatos2 ;

      });

      vm.servicioLocal.consultaVentasExcel[0]  =  ["'ID'","'SUCURSAL'","'LUGAR DE ATENCION'","'TIPO'","'BONO'","'ATENCION'","'FECHA DE EMISION'","'RUT PACIENTE'","'NOMBRE PACIENTE'","'RUT MEDICO TRATANTE'","'MEDICO TRATANTE'","'ISAPRE'","'BON ISAPRE'","'COMPANIA DE SEGURO'","'BON SEGURO'","'CCAF'","'BON CCAF'","'COSTO DE ATENCION'","'MONTO'","'COPAGO'"];
      vm.servicioLocal.consultaVentas = [];
      vm.servicioLocal.consultaVentas.push(cargaDatos);

    }

    this.insertarAtencion = function (){


      var pl = new SOAPClientParameters();
      var tipoAtencion;
      var idTipoAtencion;
      var resultadoFechaPapciente;

      switch (vm.atencion.datosAtencion.tipoAtencion) {

          case 'PARTICULAR':
              {
                  tipoAtencion = "tipoAtencionParticular";
                  resultadoFechaPapciente = "19960909";
                  vm.atencion.datosIsapre.plan = "0";
                  vm.servicioLocal.datosPaciente.rutCotizante = "00000000-0";
                  vm.servicioLocal.datosPaciente.nombreCotizante = "N";
                  vm.servicioLocal.datosPaciente.sexo = "genderUnspecified";
                  vm.servicioLocal.datosPaciente.direccionCalleBeneficiario = "N";
                  vm.servicioLocal.datosPaciente.direccionCiudadBeneficiario = "N";
                  vm.servicioLocal.datosPaciente.rutAcompanante = "00000000-0";
                  vm.servicioLocal.datosPaciente.nombreAcompanante = "N";
                  idTipoAtencion = 3;
                  break;
              }

          case 'ONLINE':
              {
                  tipoAtencion = "tipoAtencionBonificada";
                  idTipoAtencion = 1;


                  resultadoFechaPapciente = vm.servicioLocal.datosPaciente.fechaNacimientoBeneficiario.replace("-", "");
                  resultadoFechaPapciente = resultadoFechaPapciente.replace("-", "");
                  resultadoFechaPapciente=resultadoFechaPapciente.substring(0,8); 


                  break;      
              }

      } 

 
       pl.add("urn:tipoAtencion",tipoAtencion);
       pl.add("urn:idConvenio","1");
       pl.add("urn:idLugarAtencion",vm.datosSesion.lugarAtencionId);
       pl.add("urn:planGrupo",vm.atencion.datosIsapre.plan);

       pl.add("urn:rutAfiliado",vm.servicioLocal.datosPaciente.rutCotizante); 

            
       pl.add("urn:nombreAfiliado",vm.servicioLocal.datosPaciente.nombreCotizante);
       pl.add("urn:rutBeneficiario",vm.servicioLocal.datosPaciente.rut);

       pl.add("urn:apellidosBeneficiario",vm.servicioLocal.datosPaciente.apellidoPaterno + vm.servicioLocal.datosPaciente.apellidoMaterno );
       pl.add("urn:nombresBeneficiario",vm.servicioLocal.datosPaciente.nombre);
       pl.add("urn:idEstatus","1"); // en base de datos  tabla estatus 1 = ACTIVO  ¿ Cual es la logica , puede aver otro estado?
       pl.add("urn:idTipoAtencion",idTipoAtencion);


       pl.add("urn:numeroCaja","1");
       pl.add("urn:idUsuario",vm.datosSesion.idUsuario);
     
       pl.add("urn:sexo",vm.servicioLocal.datosPaciente.sexo);
       pl.add("urn:fechaNacimiento",resultadoFechaPapciente);
     
       pl.add("urn:direccion",vm.servicioLocal.datosPaciente.direccionCalleBeneficiario);

       pl.add("urn:ciudad", vm.servicioLocal.datosPaciente.direccionCiudadBeneficiario);
       pl.add("urn:rutAcompaniante",vm.servicioLocal.datosPaciente.rutAcompanante);

       pl.add("urn:nombreAcompaniante",vm.servicioLocal.idSesionCaja);     
     
       pl.add("urn:telefono","1"); // este dato biene de un campo de texto ,por mientras
       pl.add("urn:descripcionEstadoBeneficiarioIsapre","C");
       pl.add("urn:tratamientoMedico","NO"); 
       pl.add("urn:codigoDiagnostico","?");  //???????????????
       pl.add("urn:urgencia","NO");// esta bien simepre es no
       pl.add("urn:codigoEstatusBeneficiarioSeguro","1");  //??????????   */  
    //   pl.add("urn:idSesionCaja",vm.servicioLocal.idSesionCaja);  //??????????   */  
       
        
       pl.add("urn:atencion",vm.atencion.datosEnvioPrestacionesInsert[0]); 
 

        SOAPClient.invoke(url, "insertarAtencion", pl, true,function(u){ 
                                                                          $.each(u,function(k,v){

                                                                            vm.atencion.datosIdAtencion[k] =  v["ns:idAtencion"];

                                                                          }) 

                                                                          if(vm.atencion.datosAtencion.tipoAtencion == "PARTICULAR"){ //Comentario programador: si es atencionparticular se activa el boton imprimir
                                                                                                                                       // y no ocupa el servicio enviarBono 

                                                                            $("#id_imprimir_bono").attr("disabled",false);
                                                                            $("#id_enviar_mail_bono").attr("disabled",false);                                                                             
                                                                            $("#imprimir_bono").css("display","block");
                                                                           // $("#confirmar_envio_bono").css("display","none");


                                                                          }

                                                                 

                                                                        }); 
    };



vm.enviarBono = function(){


                         
                          var arrayLLenaParaEnvioBono = [];               
                          var incrementaBono = 0; 

                          angular.forEach(vm.atencion.datosCargaEnvioBono[0],function(v,k){
                              incrementaBono++
                              arrayLLenaParaEnvioBono.push(

                                                            {                             
                                                              "urn:idAtencion":vm.atencion.datosIdAtencion[k],
                                                              "urn:folioFinanciador":vm.atencion.datosFolio[k],
                                                              "urn:numeroOperacion":"1",
                                                              "urn:montoValorTotal":vm.atencion.totalMontoComprobante[k],//Monto total bono
                                                              "urn:montoAporteTotal":vm.atencion.datosBonificacionTotales[k] ,//bonificaciontotal
                                                              "urn:montoCopagoTotal": vm.atencion.datosCopagoTotales[k], // copago total                                                                                                 
                                                              "urn:montoExcedente":vm.servicioLocal.atencion.totalExedenteComprobante[k],
                                                              "urn:correlativoPrestacion":"1",
                                                              "urn:tipoSolicitud":"tipoSolicitudPrograma",    
                                                            },
                                         
                                                            angular.forEach(v,function(vv,kk){
                                                            
                                                              
                                                                 
                                                            })  
               
                                                        )
                                          })
               

                              var cargaDatosEnvioBono =[];            
                              var chunkEnvioBono;
                              var incrementaEnvioBono = 0;
                           


                              while (arrayLLenaParaEnvioBono.length > 0) {  //----while para modelar el array por cada 6 prestaciones

                                  chunkEnvioBono = arrayLLenaParaEnvioBono.splice(0,2);
                                  cargaDatosEnvioBono[incrementaEnvioBono] = chunkEnvioBono;
                                 
                                  incrementaEnvioBono++;
                              }    

                      var d = new Date();
                      var fecha = ""+("0" + d.getDate()).slice(-2)+("0" + d.getMonth()).slice(-2) + d.getFullYear()+""; 
 
                       var ArrayfechaInicio =vm.datosSesion.fechaServidor.split("-");
                      var  fechaInicio =  ArrayfechaInicio[0]+ArrayfechaInicio[1]+ArrayfechaInicio[2];
         
                      var pl = new SOAPClientParameters();
   

                      if(!vm.datosSesion.rutAcompaniante){

                          vm.datosSesion.rutAcompaniante = "000000000-0"

                      }

                  
                      pl.add("urn:fechaEmision",fechaInicio);
                      pl.add("urn:numeroConvenio",vm.servicioLocal.numeroConvenio);
                      pl.add("urn:lugarConvenio",vm.servicioLocal.lugarConvenio);
                      pl.add("urn:sucursalVenta",vm.servicioLocal.sucursalVenta);
                      pl.add("urn:rutConvenio",vm.servicioLocal.rutConvenio);
                      pl.add("urn:rutAsociado",vm.datosSesion.razonSocialRut); 
                      pl.add("urn:nombrePrestador",vm.datosSesion.nombreRazonSocialSucursal);

                      if(vm.servicioLocal.codigoEspecialidad == "GOB"){

                        pl.add("urn:rutTratante",vm.servicioLocal.rutMedico);    

                      }else{
                        
                        pl.add("urn:rutTratante",vm.servicioLocal.rutConvenio);

                      }

                      pl.add("urn:especialidad",vm.servicioLocal.codigoEspecialidad);
                      pl.add("urn:rutBeneficiario",vm.servicioLocal.datosPaciente.rut);      
                      pl.add("urn:rutCotizante",vm.servicioLocal.datosPaciente.rutCotizante);        
                      pl.add("urn:rutAcompaniante",vm.datosSesion.rutAcompaniante); 
                      pl.add("urn:rutEmisor","0084655500-5");    
                      pl.add("urn:rutCajero",vm.datosSesion.rutCajero);
                      pl.add("urn:codigoDiagnostico","?");
                      pl.add("urn:descuentoPorPlanilla","1");
                      pl.add("urn:nivelconvenio",vm.servicioLocal.numeroConvenio);
                      pl.add("urn:urgencia","1");
                      pl.add("urn:planGrupo",vm.atencion.datosIsapre.plan);
                      pl.add("urn:fechaInicio",fechaInicio);

                      
                      pl.add("urn:bonificaciones",cargaDatosEnvioBono);


                      SOAPClient.invoke(url,"enviarBono",pl, true,function(u){ 
 
                                                                          if(u[0]["ns:responseCode"] == "0"){
                                                                            
                                                                            $("#confirmar_envio_bono").css("display","none");                                                      
                                                                            $("input[name='opcion_confirma_bono']").attr("disabled",false);
                                                                            $("#id_imprimir_bono").prop("checked", "checked");
                                                                            $("#imprimeOEnviaBono").css("display","block");

                                                                              
                                                                          }



                                                                  }); 


              };


    function  consultaMedicoEspecialidadPrestacion()
      {
        var pl = new SOAPClientParameters(); 
        pl.add("urn:idLugarAtencion", vm.datosSesion.lugarAtencionId);   
        SOAPClient.invoke(url, "consultaMedicoEspecialidadPrestacion", pl, true,function(u){
          var medicos = [];
          var prestaciones = [];
          var codigoEspecialidad = [];         
          var todos = [];



          $.each(u,function(key,v){

            if(v["ns:idMedico"]){

              var dataMedicos = {  
                            id : v["ns:idMedico"], 
                            apellidoMaternoMedico : v["ns:apellidoMaternoMedico"],
                            apellidoPaternoMedico : v["ns:apellidoPaternoMedico"], 
                            codigoEspecialidad : v["ns:codigoEspecialidad"],
                            codigoMedico : v["ns:codigoMedico"],
                            idEspecialidad :v["ns:idEspecialidad"],
                            idMedico :v["ns:idMedico"],
                            nombreEspecialidad : v["ns:nombreEspecialidad"],
                            nombreMedico : v["ns:nombreMedico"] +" "+ v["ns:apellidoPaternoMedico"],
                            rutMedico : v["ns:rutMedico"]["ns:numero"]+"-"+v["ns:rutMedico"]["ns:dv"],

                          };

              var dataEspecialidad = {  
                        
                          
                            codigoEspecialidad : v["ns:codigoEspecialidad"],
                            codigoMedico : v["ns:codigoMedico"],
                            idEspecialidad :v["ns:idEspecialidad"],
                            idMedico :v["ns:idMedico"],
                            nombreEspecialidad : v["ns:nombreEspecialidad"],
                          

                          };



              medicos[v["ns:idMedico"]]  = dataMedicos; 

              codigoEspecialidad[v["ns:idEspecialidad"]]  = dataEspecialidad; 

            }   
          

          });
          
          vm.servicioLocal.medicos = medicos;
          vm.servicioLocal.ArraycodigoEspecialidad  = codigoEspecialidad;
 
         var rutConvenio;
          $.each(u,function(k,v){

            if(v["ns:numeroConvenio"]){
      
              rutConvenio = v["ns:rut-convenio"]["ns:numero"]+"-"+v["ns:rut-convenio"]["ns:dv"];
              var dataPrestacion = { 
   
                id : v["ns:idPrestacion"],  
                codigoHomologo: v["ns:codigoHomologo"],
                codigoPrestacion: v["ns:codigoPrestacion"],
                idEntidad: v["ns:idEntidad"],
                idPrestacion: v["ns:idPrestacion"],
                lugaratencionHomologo: v["ns:lugaratencionHomologo"],
                nombrePrestacion: v["ns:nombrePrestacion"],
                numeroConvenio: v["ns:numeroConvenio"],
                precioBase: v["ns:precioBase"],
                precioLugarAtencion: v["ns:precioLugarAtencion"],
                precioPrestacion: v["ns:precioPrestacion"],
                recargoHoraDesde: v["ns:recargoHoraDesde"],
                recargoHoraHasta: v["ns:recargoHoraHasta"],
                recargoMonto: v["ns:recargoMonto"],
                recargoPorcentaje: v["ns:recargoPorcentaje"],
                rutConvenio: rutConvenio,
                sucursalHomologo: v["ns:sucursalHomologo"]

              }

            }
            prestaciones[v["ns:idPrestacion"]] =  dataPrestacion;
          });         
          vm.servicioLocal.prestaciones = prestaciones;  
          console.log(vm.servicioLocal.prestaciones);
        });

      };      
      this.buscarEntidadesRutBeneficiario = function (rut){


            var pl = new SOAPClientParameters();

            var d = new Date();
            pl.add("urn:rutBeneficiario", rut); // nombre de variable debe ser igual a la del nodo del xml ("urn:rutBeneficiario" => <urn:rutBeneficiario>)
                                                          // el valor de  cualquier rut va completo la clase soapclient.js en el metodo this.toXml se encarga de 
                                                         // generar y  dividir el numero y el dijito verificador y crea la estructura de el nodo xml con el cual estamos trabajando : 
                                                         // <urn:rutBeneficiario>
                                                         //   <urn:numero>0010179892</urn:numero>
                                                         //   <urn:dv>5</urn:dv>
                                                         // </urn:rutBeneficiario>

         //   pl.add("urn:fechaActual",("0" + d.getDate()).slice(-2)+("0" + d.getMonth()).slice(-2) + d.getFullYear());
 
            SOAPClient.invoke(url, "buscarEntidadesRutBeneficiario", pl, true,function (u)
            {
                  if(u == null){

                    alert("Sin respuesta de Servicio");
                                     
                  }else if(u["ns:responseDescription"] == "RUT BENEFICIARIO INVALIDO"){

 
                    $("#contenido_mensaje").html(vm.servicioLocal.datosMensaje.rut_invalido);
                    $("#modal_mensajes").modal('show'); 
   

                  }else if(u["ns:responseDescription"] == "BENEFICIARIO NO TIENE ISAPRE"){

                        $("#contenido_mensaje").html(""); 
                        $("#contenido_mensaje").html(vm.servicioLocal.datosMensaje.rut_no_afiliado); 
                        $("#alerta_mensajes").addClass("b_0");
                        $("#modal_mensajes").modal('show'); 

                        if($("#id_rut_nuevoOantiguo").text() == "nuevo"){ // valor si el rut es nuevo 

                          $("#NombreBeneficiario").attr("disabled",false);

                          var apellidos = $("#apellido_login").text();
                          apellidos = apellidos.split(" ");

                          servicioLocal.pushDatosPaciente( { 

                            nombre: $("#nombre_login").text(),
                            apellidoPaterno: apellidos[0],
                            apellidoMaterno: apellidos[1],
                            rut: $("#campo_texto_rut-paciente").val(),
                            nombre: $("#nombre_login").text(),
                            bonificaion : false,

                          });

                        }

                        if($("#id_rut_nuevoOantiguo").text() == "antiguo"){ // valor si el rut es nuevo 

                          var apellidos = $("#apellido_login").text();
                          apellidos = apellidos.split(" ");

                          servicioLocal.pushDatosPaciente( { 

                            nombre: $("#apellido_login").text(),
                            apellidoPaterno: $("#apellido_login").text(),
                            apellidoMaterno: $("#apellido_login").text(),
                            rut: $("#campo_texto_rut-paciente").val(),
                            bonificaion : false,

                          });

                        }                        
                                
                        if(vm.$stateParams.nombreOpcion == 'ram'){
                          return  vm.$state.go(vm.$stateParams.nombreOpcion); 
                        }else{

                          return  vm.$state.go('ramsimulacion'); 

                        }



                        }else{ // trae datos del servicio ---------------------------------

                          var cargaDatos = {};
                            $.each(u,function(k,v){ 

                                var res = k.replace("-", "_");
                                var res = res.replace("-", "_");            
                                var res = res.replace("ns:", "");

                                cargaDatos[res] = v;
                            });
                            //formo los rut
           
                            var rutAcompanante;
                            var nombreAcompaniante;
           
                            if(cargaDatos.rutAcompanante["ns:numero"] == 0){ 
                             
                              rutAcompanante = "00000000-0";
                              nombreAcompaniante = "?";

                            }else{
                            
                              var rutAcompanante = cargaDatos.rutAcompanante["ns:numero"]+"-"+cargaDatos.rutAcompanante["ns:dv"]; 
                              nombreAcompaniante = cargaDatos.nombreAcompanante; 

                            } 


                            var rutCotizante = cargaDatos.rutCotizante["ns:numero"]+"-"+cargaDatos.rutCotizante["ns:dv"];

                            // Fin ------------formo los rut  

                            vm.servicioLocal.atencion.datosTitular.rut = rutCotizante;
                            
           
                            //Agrego variebles de paciente           url_valoriza 
                              servicioLocal.pushDatosPaciente(
                              {  
                                nombre: cargaDatos.nombresBeneficiario,
                                apellidoPaterno: cargaDatos.apellidoPaternoBeneficiario ,
                                apellidoMaterno: cargaDatos.apellidoMaternoBeneficiario ,
                                rut: $("#campo_texto_rut-paciente").val(),
                               
                                codigoEstadoBeneficiario: cargaDatos.codigoEstadoBeneficiario,
                                codigoSeguro  : cargaDatos.codigoSeguro,
                                descuentoPorPlanilla : cargaDatos.descuentoPorPlanilla,
                                direccionCalleBeneficiario : cargaDatos.direccionCalleBeneficiario,              
                                direccionCiudadBeneficiario : cargaDatos.direccionCiudadBeneficiario,
                                direccionComunaBeneficiario : cargaDatos.direccionComunaBeneficiario,
                                fechaNacimientoBeneficiario : cargaDatos.fechaNacimientoBeneficiario,
                                isapre : cargaDatos.isapre,
                                montoExcedente : cargaDatos.montoExcedente,
                              
                                nombreAcompanante : nombreAcompaniante,
                                
                                previsionBeneficiario : cargaDatos.previsionBeneficiario,
                                
                                rutAcompanante : rutAcompanante,
                                rutCotizante : rutCotizante,
                                nombreCotizante: cargaDatos.nombreCotizante,
                                
                                seguro : cargaDatos.seguro,
                                sexo : cargaDatos.sexo,
                                bonificaion : true,

                              });


                            
                              if(vm.$state.current.name == 'simulacion' ){
  
                                return  vm.$state.go("ramsimulacion"); 

                              }else{

                                return  vm.$state.go(vm.$stateParams.nombreOpcion);  
                              }
 

    
                        } // FIN  trae datos del servicio ---------------------------------------------
  
               
                
              $("#accionEnToc").text("");
                           
            });

      };
      
    vm.segundosGloval;
    vm.minutosGloval;
    vm.horaGloval;

      function timedCount(segundo,minuto,hora) {

          segundo++;
 
          if(segundo == 60){

              segundo = 0;
              minuto++
              if(minuto == 60){

                  minuto = 0;
                  hora++;
                  if (hora==24){

                      hora = 0;
                  }
              }

          }
          setTimeout(function(){ timedCount(segundo,minuto,hora) }, 1000);

          vm.segundosGloval = segundo;
          vm.minutosGloval = minuto;
          vm.horaGloval = hora;
         
      }
        

      this.validarSupervisor = function (rut){

           var pl = new SOAPClientParameters();

            pl.add("urn:rutUsuario",rut);             
            pl.add("urn:macEquipo",rut);
 
            SOAPClient.invoke(url, "validarUsuario", pl, true,function (u)
            {
                if(u == null){
                
                  alert("Sin respuesta de Servicio");

                }else if(u["ns:responseDescription"] == "RUT USUARIO INVALIDO"){

                    $("#alerta_mensajes").addClass("b_1"); 
                    $("#contenido_mensaje").html(vm.servicioLocal.datosMensaje.rut_invalido); 
                    $("#modal_mensajes").modal('show'); 
   

                }else if(u["ns:responseDescription"] == "FAIL"){
                  
                    $("#alerta_mensajes").addClass("b_1"); 
                    $("#contenido_mensaje").html(vm.servicioLocal.datosMensaje.rut_invalido);
                    $("#modal_mensajes").modal('show'); 
                }else{          

                var cargaDatos = {};
                $.each(u,function(k,v){ 

                    var res = k.replace("-", "_");
                    var res = res.replace("-", "_");            
                    var res = res.replace("ns:", "");

                    cargaDatos[res] = v;
                });

                var esSupervisor = false;  

                if(cargaDatos.idPerfilUsuario =="2"){

                  esSupervisor = true;

                }

                       
                    var datosSupervisor =  {

                        usuarioNroCaja :cargaDatos.numeroCaja,

                        lugarAtencionId: cargaDatos.idLugarDeAtencion,

                        lugarAtencionNombre: cargaDatos.nombreLugarDeAtencion,

                        razonSocialRut: cargaDatos.rutRazonSocialSucursal['ns:numero']+"-"+cargaDatos.rutRazonSocialSucursal["ns:dv"],

                        nombreRazonSocialSucursal : cargaDatos.nombreRazonSocialSucursal,

                        nombreSucursal : cargaDatos.nombreSucursal,                 

                        sucursalId: cargaDatos.idSucursal,

                        usuarioNombreCompleto: cargaDatos.nombreUsuario + " " +cargaDatos.apellidoPaternoUsuario + " " +cargaDatos.apellidoMaternoUsuario,

                        fechaHoraServidor : cargaDatos.fechaHoraServidor,

                        horaServidor : cargaDatos.fechaHoraServidor.substring(11,19), 

                        fechaServidor : cargaDatos.fechaHoraServidor.substring(0,10),
                        
                        horarioRecargoDesde : cargaDatos.hora_recargo_desde,

                        horarioRecargoHasta : cargaDatos.hora_recargo_hasta,

                        sucursalId : cargaDatos.idSucursal,

                        descripcionPerfilUsuario: cargaDatos.descripcionPerfilUsuario,

                        idPerfilUsuario:cargaDatos.idPerfilUsuario,

                        idRazonSocialSucursal: cargaDatos.idRazonSocialSucursal,

                        idUsuario : cargaDatos.idUsuario,

                        monto_recargo : cargaDatos.monto_recargo,

                        porcentaje_recargo : cargaDatos.porcentaje_recargo,
             
                        rolPerfilUsuario : cargaDatos.rolPerfilUsuario,
             
                        rutCajero : $("#campo_texto_rut_supervisor").val(),

                        esSupervisor : esSupervisor,
                      }

  
                    servicioLocal.datosSupervisor.push(datosSupervisor);
                        
                }
 
                if( $(".modal-titulo").text() ==  "ANULAR BONO"){ 

                  if(datosSupervisor.esSupervisor != -1 ){

                    $("#accionEnTocDesbloquear").text("SUPERVISOR IDENTIFICADO CON EXITO");
                    $("#fingersToScanImage").attr("src","images/fingerprint.png");
                    $("#mensaje_exito").text(" ");
                    $("#cerra_bloquear_caja").click();
              
             
                  }else{

                    $("#mensaje_exito").text("DATOS DE : " + cargaDatos.nombreUsuario + " " +cargaDatos.apellidoPaternoUsuario + " " +cargaDatos.apellidoMaternoUsuario + " NO CORRESPONDEN A SUPERVISOR");

                  }

                }

                if($(".modal-titulo").text() == "DESBLOQUEAR CAJA"){

 
                  if(datosSupervisor.idUsuario == vm.datosSesion.idUsuario ){


                    $("#accionEnTocDesbloquear").text("COLOCA EL RUT DEL OPERADOR");
                    $("#fingersToScanImage").attr("src","images/fingerprint.png");
                    $("#mensaje_exito").text(" ");
                    $("#cerra_bloquear_caja").click();
      
             
                  }else{

                    $("#mensaje_exitoDesbloquear").text("DATOS DE  : " + cargaDatos.nombreUsuario + " " +cargaDatos.apellidoPaternoUsuario + " " +cargaDatos.apellidoMaternoUsuario + " NO CORRESPONDEN AL OPERADOR");

                  }


                }  

                           
            });

      };

      this.validarUsuario = function (rut){

            var pl = new SOAPClientParameters();

            pl.add("urn:rutUsuario",rut);             
            pl.add("urn:macEquipo",rut);
    
            SOAPClient.invoke(url, "validarUsuario", pl, true,function (u)
            {

                if(u == null){
                
                    alert("Sin respuesta de Servicio");
                }else if(u["ns:responseDescription"] == "RUT USUARIO INVALIDO"){

                    $("#alerta_mensajes").addClass("b_1"); 
                    $("#contenido_mensaje").html(vm.servicioLocal.datosMensaje.rut_invalido); 
                    $("#modal_mensajes").modal('show'); 
   

                }else if(u["ns:responseDescription"] == "FAIL"){
                  
                    $("#alerta_mensajes").addClass("b_1"); 
                    $("#contenido_mensaje").html(vm.servicioLocal.datosMensaje.rut_invalido);
                    $("#modal_mensajes").modal('show'); 
                }    
                else{          

                var cargaDatos = {};
                $.each(u,function(k,v){ 

                    var res = k.replace("-", "_");
                    var res = res.replace("-", "_");            
                    var res = res.replace("ns:", "");

                    cargaDatos[res] = v;
                });


                    var cargaRut = [];
   
      
                    var datosSesion =  {

                        usuarioNroCaja :cargaDatos.numeroCaja,

                        lugarAtencionId: cargaDatos.idLugarDeAtencion,

                        lugarAtencionNombre: cargaDatos.nombreLugarDeAtencion,

                        razonSocialRut: cargaDatos.rutRazonSocialSucursal['ns:numero']+"-"+cargaDatos.rutRazonSocialSucursal["ns:dv"],

                        nombreRazonSocialSucursal : cargaDatos.nombreRazonSocialSucursal,

                        nombreSucursal : cargaDatos.nombreSucursal,                 

                        sucursalId: cargaDatos.idSucursal,

                        usuarioNombreCompleto: cargaDatos.nombreUsuario + " " +cargaDatos.apellidoPaternoUsuario + " " +cargaDatos.apellidoMaternoUsuario,

                        fechaHoraServidor : cargaDatos.fechaHoraServidor,

                        horaServidor : cargaDatos.fechaHoraServidor.substring(11,19), 

                        fechaServidor : cargaDatos.fechaHoraServidor.substring(0,10),
                        
                        horarioRecargoDesde : cargaDatos.hora_recargo_desde,

                        horarioRecargoHasta : cargaDatos.hora_recargo_hasta,

                        sucursalId : cargaDatos.idSucursal,

                        descripcionPerfilUsuario: cargaDatos.descripcionPerfilUsuario,

                        idPerfilUsuario:cargaDatos.idPerfilUsuario,

                        idRazonSocialSucursal: cargaDatos.idRazonSocialSucursal,

                        idUsuario : cargaDatos.idUsuario,

                        monto_recargo : cargaDatos.monto_recargo,

                        porcentaje_recargo : cargaDatos.porcentaje_recargo,
             
                        rolPerfilUsuario : cargaDatos.rolPerfilUsuario,
             
                        rutCajero : $("#id_rut_apertura_caja").html(),
                      }


        
                    var segMinHor = datosSesion.horaServidor.split(":");

                    var segundo = segMinHor[2];
                    var minuto = segMinHor[1];
                    var hora = segMinHor[0];
                      
                    var fechaHora = new Date();
                    var horasDate = fechaHora.getHours();
                    var minutosDate = fechaHora.getMinutes();
                    var segundosDate = fechaHora.getSeconds();

                    timedCount(segMinHor[2],segMinHor[1],segMinHor[0]);

                    servicioLocal.pushDatosSesion(datosSesion);
                    consultaMedicoEspecialidadPrestacion();                    

                    return    vm.$state.go('aperturaCaja');
                        
                }
                
              $("#accionEnToc").text("");          
                           
            });

      };

// ----------------------------------------------------Inicio valorizarPrestaciones -----------------------------------------------------------
   
    this.valorizarPrestaciones = function () {

      
    //     console.log("Hora relojito =>"+vm.horaGloval +":"+ vm.minutosGloval +":"+vm.segundosGloval);

            var prestacionesTotales = [];
            var unixRelojito =  moment(vm.datosSesion.fechaServidor+vm.horaGloval +":"+ vm.minutosGloval +":"+vm.segundosGloval).unix();
            
      angular.forEach(vm.atencion.datosPrestacionesValorizar,function(v,k){
                if(v.unixDesde >= unixRelojito || v.unixHasta <= unixRelojito ){
                  var recargoFueraHorario = 1;
                 }else{
                  var recargoFueraHorario = 0;
                }
                var prestaciones = {
                  "urn:codigo":"0000"+v.codigo,
                  "urn:tipo":0,
                  "urn:codigoAdicional":"0"+v.codigo,
                  "urn:recargoFueraHorario":recargoFueraHorario,
                  "urn:cantidad":"0"+v.cantidad,
                  "urn:valor":v.valor,//"000000000000",
                }
                prestacionesTotales.push(prestaciones);
            });

            vm.horaGloval = 0;
            vm.minutosGloval = 0;
            vm.segundosGloval = 0;
 
        vm.cargaDatos = {};

        var pl = new SOAPClientParameters();

            pl.add("urn:isapre","isapreConsalud");
            pl.add("urn:agrupadorSeguro","0"); 
            pl.add("urn:idSeguro","0");
            pl.add("urn:codigoSeguro",vm.servicioLocal.rutConvenio);              
            pl.add("urn:caja","0");
            pl.add("urn:numeroConvenio",vm.servicioLocal.numeroConvenio);
            pl.add("urn:lugarConvenio",vm.servicioLocal.lugarConvenio);
            pl.add("urn:sucursalVenta",vm.servicioLocal.sucursalVenta);

            pl.add("urn:numeroOperacion",'213456');  

            pl.add("urn:rutConvenio",vm.servicioLocal.rutConvenio);

            if(vm.servicioLocal.codigoEspecialidad == "GOB"){
              pl.add("urn:rutTratante",vm.servicioLocal.rutMedico);    
            }else{
              pl.add("urn:rutTratante",vm.servicioLocal.rutConvenio);
            }

            pl.add("urn:especialidadTratante",vm.servicioLocal.codigoEspecialidad);
            pl.add("urn:rutSolicitante",vm.servicioLocal.datosPaciente.rutCotizante);    
            pl.add("urn:rutBeneficiario",vm.servicioLocal.datosPaciente.rut);
    
            pl.add("urn:tratamiento","N");
            pl.add("urn:codigoDiagnostico","");
            pl.add("urn:nivelConvenio","1");
            pl.add("urn:urgencia","0");
            pl.add("urn:prestaciones",prestacionesTotales);
       
            SOAPClient.invoke(url, "valorizarPrestacion", pl, true,function (u)
                {
                    if (/PRESTACION [0-9]* YA EMITIDA  /.test(u[2])){
                        $("#alerta_mensajes").addClass("b_0");
                        $("#contenido_mensaje").html("");                         
                        $("#contenido_mensaje").html("PACIENTE CON " +u[2]); 
                        $("#modal_mensajes").modal('show');

                        return
                    }   

                    if ("ERROR EN RESPUESTA CONSALUD" == u[2]){
 
                        $("#alerta_mensajes").addClass("b_1");
                        $("#contenido_mensaje").html("");                         
                        $("#contenido_mensaje").html(vm.servicioLocal.datosMensaje.no_ws_valorizar_prestacion);
                       
                        $("#modal_mensajes").modal('show');
                        $("#close-modal").click(function(){
      
                        });

                        return

                    }   
                    if(u == null){

                        alert("Sin respuesta de Servicio");
                    
                    }else if("1000001XServicio Correcto" == u[2]){   //-----------------------Si el servicio viene con respuesta ---------------------------          
                    u.splice(0,1); 
                    vm.atencion.datosIsapre.plan =  u[4]; 
                    u.splice(0,1);
                    u.splice(0,1); 
                    u.splice(0,1);     
                    u.splice(0,1); 
                    u.splice(0,1); 

                    var incrementa = 0;
                    var llave ;
                    var cantidad;
                    var cargaDatos = [];

                    $.each(u,function(k,v){

                        if( typeof v != "object"  ){
                             
                            cargaDatos[k] = v;   
                            cantidad =(parseInt(k) / parseInt(4));
                        }
                
                    })

                    var internoIsapre = []
             
                    var cargaDatosPrestaciones =[];            
                    var chunk;
                    var incrementa2 = 0;
                    var incrementaInternoIsapre = 0;
                    while (cargaDatos.length > 0) {
                        chunk = cargaDatos.splice(0,Math.round(cantidad));
                        if(incrementa2 != 3){
                            cargaDatosPrestaciones[incrementa2] = chunk;
                        }else{
                            internoIsapre[incrementaInternoIsapre] = chunk;
                            incrementaInternoIsapre++;
                        }
                        incrementa2++;
                    }

                    var   totalPrestacion = 0;
                    var   totalAporteFinanciador = 0;
                    var   totalCopagos = 0;

                    angular.forEach(vm.atencion.datosPrestaciones, function (v,k) {                          

                        for(var i = 0; i < cargaDatosPrestaciones.length ; i++)                       
                        {
                            if( typeof cargaDatosPrestaciones[i][k] != "undefined"){
                                vm.atencion.datosCargaEnvioBono[k]["urn:internoIsapre"] =  internoIsapre[0][k];
                                if(i == 0){
                                    vm.atencion.datosCargaEnvioBono[k]["urn:valorPrestacion"] = cargaDatosPrestaciones[i][k];
                                    vm.atencion.datosPrestaciones[k].valorPrestacion = cargaDatosPrestaciones[i][k];  
                                    vm.atencion.datosPrestacionesComprobante[k].valorPrestacion = cargaDatosPrestaciones[i][k];
                                    vm.atencion.datosPrestacionesInsert[k]["urn:monto"] = cargaDatosPrestaciones[i][k];
                                    totalPrestacion = parseInt(totalPrestacion) + parseInt(cargaDatosPrestaciones[i][k]);   
                                }
                                if(i == 1){
                                    vm.atencion.datosCargaEnvioBono[k]["urn:aporteFinanciador"] = cargaDatosPrestaciones[i][k];
                                    vm.atencion.datosPrestaciones[k].aporteFinanciador = cargaDatosPrestaciones[i][k];
                                    vm.atencion.datosPrestacionesComprobante[k].aporteFinanciador = cargaDatosPrestaciones[i][k]; 
                                    vm.atencion.datosPrestacionesInsert[k]["urn:montoBonificacion"] = cargaDatosPrestaciones[i][k]; 
                                    vm.atencion.datosPrestacionesInsert[k]["urn:bonificacion"] = cargaDatosPrestaciones[i][k];                                     
                                    totalAporteFinanciador =parseInt(totalAporteFinanciador) + parseInt(cargaDatosPrestaciones[i][k]);  
                                }
                                 if(i === 2){
                                    vm.atencion.datosCargaEnvioBono[k]["urn:copago"] = cargaDatosPrestaciones[i][k];
                                    vm.atencion.datosPrestaciones[k].copago  = cargaDatosPrestaciones[i][k];
                                    vm.atencion.datosPrestacionesComprobante[k].copago = cargaDatosPrestaciones[i][k];
                                    vm.atencion.datosPrestacionesInsert[k]["urn:copago"] = cargaDatosPrestaciones[i][k]; 
                                    totalCopagos = parseInt(totalCopagos) + parseInt(cargaDatosPrestaciones[i][k]);

                                }                                                 
                         
                            }

                        }
                          
                    });

 
                    vm.atencion.datosPago.totales.copago = totalCopagos;   
                    vm.atencion.datosPago.totales.montoIsapre =  totalAporteFinanciador;  
                    vm.atencion.datosPago.totales.total =  totalPrestacion; 
 
 
                    if(vm.servicioLocal.datosPaciente.montoExcedente !== 0){ 
                       
                      if(vm.servicioLocal.datosPaciente.montoExcedente > totalCopagos ){

                        vm.atencion.datosPago.totales.montoExcedenteUsar = totalCopagos;  
                        vm.atencion.datosPago.totales.montoExcedentePendiente = totalCopagos;
                        vm.atencion.datosPago.totales.montoExcedenteInicial = totalCopagos;// se ocupa para comparar en ram.js en  vm.agragarPago()

                        
                      }else{

                        vm.atencion.datosPago.totales.montoExcedentePendiente = vm.servicioLocal.datosPaciente.montoExcedente;          
                        vm.atencion.datosPago.totales.montoExcedenteUsar = vm.servicioLocal.datosPaciente.montoExcedente;
                        vm.atencion.datosPago.totales.montoExcedenteInicial = vm.servicioLocal.datosPaciente.montoExcedente; // se ocupa para comparar en ram.js en  vm.agragarPago()

                      }

                    }else{

                      vm.atencion.datosPago.totales.montoExcedentePendiente = 0;    
                      vm.atencion.datosPago.totales.montoExcedenteUsar = 0;
                      vm.atencion.datosPago.totales.montoExcedenteInicial = 0; // seocupa para comparar en ram.js en  vm.agragarPago()          

                    }

                    vm.atencion.datosIsapre.nivelConvenio = "BONIFICADA";


        
                  $("#id_btn_valorizar_online").css("display","none");
                  $("#id_btn_pagar_online").css("display","block");    

                  vm.atencion.datosAtencion.estadoAtencion = 'VALORIZADA';   
                  $("#id_btn_pagar_online").removeAttr("disabled");

                    $timeout(function() {
                        var el = document.getElementById('valor');
                        angular.element(el).triggerHandler('click');
                    }, 0);                   
           

                } //------------------------------------Fin  si el servicio viene con respuesta-------------------------------    

        
            });

 
        
        };



 
this.solicitarFolio = function (cantidad)
{
if(vm.atencion.datosAtencion.tipoAtencion == "PARTICULAR"){

  return

}
  var pl = new SOAPClientParameters();
  pl.add("urn:numeroFolios",cantidad); 

  SOAPClient.invoke(url, "solicitarFolio", pl, true, function(u)
                                                      {
                                                          u.splice(0,1);
                                                          u.splice(0,1);
                                                          $.each(u,function(k,v){
                                                                                                
                                                            vm.atencion.datosFolio[k] = v;

                                                        });
                                 
                                                      });
 
}


  this.consultaMensaje = function()
  {
 
    var pl = new SOAPClientParameters();
    pl.add("urn:offset", "1");  
    pl.add("urn:length", "100");
    pl.add("urn:idEntidad", "4");
    pl.add("urn:idSistema", "1");   


    SOAPClient.invoke(url, "consultaMensaje", pl, true,Mensajes_callBack);

  }
 
    function Mensajes_callBack(u)
    {
      var cargaDatos = [];
      var incrementa = 0;

      $.each(u,function(kk,vv){
     
        cargaDatos[vv["ns:codigoMensaje"]] = vv["ns:descripcionMensaje"];

      });
   
 
     vm.servicioLocal.datosMensaje = cargaDatos; 

    } 

  this.consultaDatosCierreCaja = function()
  {

    var pl = new SOAPClientParameters();

    pl.add("urn:idSesion",vm.servicioLocal.idSesionCaja);  

    SOAPClient.invoke(url, "consultaDatosCierreCaja", pl, true,consultaDatosCierreCaja_callBack);

  }
 
  function consultaDatosCierreCaja_callBack(u)
  {


 
    if(u[0] == "-1"){


        if(u[1] == "Sin datos"){

              vm.servicioLocal.datosDetalleCaja = [];
              vm.servicioLocal.datosDetalleCajaMedioPago = [];
              vm.servicioLocal.montosRegistrados =  {
                                  0: 0,
                                  1: 0,  
                                  2: 0,
                                  3: 0, 
                                  4: 0,
                                  5: 0
                              
                              };

            vm.servicioLocal.cantidadAtenciones = 0;

            vm.servicioLocal.montoAperturaCaja = 0;

            vm.servicioLocal.montoRecaudado = 0;

            vm.servicioLocal.totalMontoDiferencia = 0;

        } 

    }  
    if(u[0] == "0"){

        var cargaDatos = [];
        var cargaDatos2 = [];    
        var cargaDatosDetalle = [];    
        var cargaDatosEfectivo = [];     
        var cargaDatosExcedente = []; 
        var cargaDatosCheque = [];     

        var countCantidadPagosEfectivo = 0;
        var totalMontoPagosEfectivo = 0;    

        var countCantidadPagosExcedente = 0;
        var totalMontoPagosExcedente = 0;  

        var countCantidadPagosCheque = 0;
        var totalMontoPagosCheque = 0; 

        var countCantidadPagosIsapre = 0;
        var totalMontoPagosIsapre = 0; 

        var countCantidadPagosSeguro = 0;
        var totalMontoPagosSeguro = 0;     

        var countCantidadPagosCaja= 0;
        var totalMontoPagosCaja = 0;


     
        if(u[1] == "OK"){



      //    vm.servicioLocal.fechaAperturaCaja = u[2]["ns:fechaApertura"];


          vm.servicioLocal.montoAperturaCaja = u[2]["ns:montoApertura"];
          

          vm.servicioLocal.cantidadAtenciones = u[2]["ns:cantidadAtenciones"];
          u.splice(0,1);
          u.splice(0,1);
          var incrementa = 0;         

          $.each(u,function(k,v){

            if(v["ns:montoEfectivo"] != 0){

              if(typeof  v["ns:montoEfectivo"] != "undefined"){

                countCantidadPagosEfectivo++;
                totalMontoPagosEfectivo = parseInt(totalMontoPagosEfectivo) + parseInt(v["ns:montoEfectivo"]);

                vm.servicioLocal.montoRecaudado += parseInt(totalMontoPagosEfectivo);


              }

              cargaDatosEfectivo = {

                      idTipoPago : 1,        
                      nomTipoPago : "Efectivo",
                      fechaApertura : v["ns:fechaApertura"],
                      cantidadPagos : countCantidadPagosEfectivo,
                      totalMonto : totalMontoPagosEfectivo,
                      montoRecaudado : 0,

                  };

            }


            if(v["ns:montoCheque"] != 0){

              if(typeof  v["ns:montoCheque"] != "undefined"){

                countCantidadPagosCheque++;
                totalMontoPagosCheque = parseInt(totalMontoPagosCheque) + parseInt(v["ns:montoCheque"]);
                vm.servicioLocal.montoRecaudado += parseInt(totalMontoPagosCheque);

              }
       
              cargaDatosCheque = {

                      idTipoPago : 2,        
                      nomTipoPago : "CHEQUE",
                      fechaApertura : v["ns:fechaApertura"],
                      cantidadPagos : countCantidadPagosCheque,
                      totalMonto : totalMontoPagosCheque,
                      montoRecaudado : 0,

                  };

            }


            if(v["ns:montoExcedente"] != 0){

              if(typeof  v["ns:montoExcedente"] != "undefined"){

                countCantidadPagosExcedente++;
                totalMontoPagosExcedente = parseInt(totalMontoPagosExcedente) + parseInt(v["ns:montoExcedente"]);
                vm.servicioLocal.montoRecaudado += parseInt(totalMontoPagosExcedente);
              }
              cargaDatosExcedente = {

                      idTipoPago : 3,        
                      nomTipoPago : "Excedente",
                      fechaApertura : v["ns:fechaApertura"],
                      cantidadPagos : countCantidadPagosExcedente,
                      totalMonto : totalMontoPagosExcedente,
                      montoRecaudado : 0,

                  };

            }  

            if(v["ns:montoIsapre"] != 0){

              if(typeof  v["ns:montoIsapre"] != "undefined"){

                countCantidadPagosIsapre++;
                totalMontoPagosIsapre = parseInt(totalMontoPagosIsapre) + parseInt(v["ns:montoIsapre"]);
                vm.servicioLocal.montoRecaudado += parseInt(totalMontoPagosIsapre);          

              }
              cargaDatosIsapre = {

                      idTipoPago : 4,        
                      nomTipoPago : "ISAPRE",
                      fechaApertura : v["ns:fechaApertura"],
                      cantidadPagos : countCantidadPagosIsapre,
                      totalMonto : totalMontoPagosIsapre,
                      montoRecaudado : 0,

                  };

            }   

            if(v["ns:montoSeguro"] != 0){

              if(typeof  v["ns:montoSeguro"] != "undefined"){

                countCantidadPagosSeguro++;
                totalMontoPagosSeguro = parseInt(totalMontoPagosSeguro) + parseInt(v["ns:montoSeguro"]);
               

              }
              cargaDatosSeguro = {

                      idTipoPago : 5,        
                      nomTipoPago : "SEGURO",
                      fechaApertura : v["ns:fechaApertura"],
                      cantidadPagos : countCantidadPagosSeguro,
                      totalMonto : totalMontoPagosSeguro,
                      montoRecaudado : 0,

                  };

            }  

            if(v["ns:montoCaja"] != 0){

              vm.servicioLocal.montoAperturaCajaDetalle;
              vm.servicioLocal.cantidadAtencionesDetalle;

              if(typeof  v["ns:montoCaja"] != "undefined"){

                countCantidadPagosCaja++;
                totalMontoPagosCaja = parseInt(totalMontoPagosCaja) + parseInt(v["ns:montoCaja"]);
       

              }
              cargaDatosCaja = {

                      idTipoPago : 6,        
                      nomTipoPago : "CAJA",
                      fechaApertura : v["ns:fechaApertura"],
                      cantidadPagos : countCantidadPagosCaja,
                      totalMonto : totalMontoPagosCaja,
                      montoRecaudado : 0,

                  };

            }   

            vm.servicioLocal.montoRecaudado = parseInt(totalMontoPagosCaja) + parseInt(totalMontoPagosSeguro) + parseInt(totalMontoPagosIsapre) + parseInt(totalMontoPagosExcedente) + parseInt(totalMontoPagosCheque)  + parseInt(totalMontoPagosEfectivo);    
       

          });


          cargaDatos[0] = cargaDatosEfectivo;

          cargaDatos[1] = cargaDatosCheque;

          cargaDatos[2] = cargaDatosExcedente;  

          cargaDatos[3] = cargaDatosIsapre;

          cargaDatos[4] = cargaDatosSeguro;

          cargaDatos[5] = cargaDatosCaja;        

          vm.servicioLocal.datosDetalleCaja = cargaDatos; 


          $timeout(function () {


              var sumaMontos=0;
              var sumaMontosRecaudados  = 0;
              var sumaCantidad=0;    
              var sumaDiferencia=0;
              var countInputDisabled = 0;              

                $("#tabla_cierre_caja tbody tr").each(function(k,v){


                    sumaMontos += parseInt($("#id_"+k+"_monto_ws").text()); // sumo total "MONTOS"

                    $("#total_monto_footer").text(sumaMontos);

                    sumaMontosRecaudados += parseInt($("#id_"+k+"_monto_recaudado").val()); // sumo total "MONTO RECAUDADO"

                    $("#total_monto_recaudado_footer").text(sumaMontosRecaudados);
       
                    sumaCantidad += parseInt($("#id_"+k+"_cantidad").text());// sumo total "CANTIDAD"
       

                    $("#total_cantidad_footer").text(sumaCantidad);

                    var diferencia =    $("#id_"+k+"_diferencia").text();

                    $("#id_"+k+"_diferencia").text(diferencia);

                      diferencia = parseInt($("#id_"+k+"_monto_ws").text()) - parseInt($("#id_"+k+"_monto_recaudado").val()); 

                      $("#id_"+k+"_diferencia").text(diferencia);

                            
                      if(!diferencia){

                        diferencia = 0;

                      }
                       
                      sumaDiferencia += parseInt(diferencia);

                      $("#total_diferencia_footer").text(sumaDiferencia);
       
                      console.log(sumaDiferencia);



                      vm.servicioLocal.totalMontoDiferencia = sumaDiferencia;

                 
                      if($("#id_"+k+"_monto_ws").text() == 0){

                          countInputDisabled++

                          $("#id_"+k+"_monto_recaudado").attr("disabled",true);


                      }


                      if(diferencia == 0 &&   $("#id_"+k+"_monto_ws").text() != 0 ){
                        $("#id_btn_validacion_"+k).removeClass().addClass("ver-ver input-group-addon"); 
                        $("#id_btn_validacion_"+k).children().removeClass().addClass("glyphicon glyphicon-ok"); 
                      }else if(diferencia != 0){

                        $("#id_btn_validacion_"+k).removeClass().addClass("roj-roj input-group-addon"); 
                        $("#id_btn_validacion_"+k).children().removeClass().addClass("glyphicon glyphicon-remove"); 

                      }
              

                });


              var incrementoActivaCuadraCaja = 0;
              $("#tabla_cierre_caja .input-group span").each(function(k,v){

                   
                if($(this).hasClass('ver-ver')) {

                    incrementoActivaCuadraCaja++

                    if(incrementoActivaCuadraCaja ==  6  - parseInt(countInputDisabled)){

                      $("#btn_cuadrar_caja").attr("disabled",false);

                    }else{

                      $("#btn_cuadrar_caja").attr("disabled",true);   
                    }

                } 

              }); 


              $("#id_0_monto_recaudado").numeric(); 
              $("#id_1_monto_recaudado").numeric();  
              $("#id_2_monto_recaudado").numeric(); 
              $("#id_3_monto_recaudado").numeric();
              $("#id_4_monto_recaudado").numeric();  
              $("#id_5_monto_recaudado").numeric(); 
       

              $("#id_efectivo_monto_recaudado").numeric();


              $("tbody tr:odd").addClass("even"); // filas pares
              $("tbody tr:even").addClass("odd"); // filas impares

              

            },2000);

        }//fin if(u[1] != "no_existen_resumenCierreCaja_ni_detalleCierreCajas")


    } // Fin     if(u[0] !== "-1"){   
   
  } //fin consultaDatosCierreCaja_callBack


  this.detalleCajaMedioPago = function(tipoPago)
  {
    
    var pl = new SOAPClientParameters();


    vm.servicioLocal.detalleTipoPagoSeleccionado = tipoPago;
  
    pl.add("urn:idSesion",vm.servicioLocal.idSesionCaja);  
  
    SOAPClient.invoke(url, "detalleCajaMedioPago", pl, true,detalleCajaMedioPago_callBack);

  }
 
  function detalleCajaMedioPago_callBack(u)
  {
    var cargaDatos = [];
    var cargaDatos2 = [];      
    var incrementa = 0;
    var valorTipoPago;

    $.each(u,function(k,v){

      if(vm.servicioLocal.detalleTipoPagoSeleccionado == 1){

        if(v["ns:montoEfectivo"] != 0){
          
            cargaDatos = { 
                          idAtencion : v["ns:idAtencion"], 
                          nomTipoPago : "EFECTIVO",      
                          numeroBono : v["ns:numeroBono"],
                          fechaBono : v["ns:fechaBono"],
                          rutBenef : v["ns:rutBenef"],
                          nombrePaciente : v["ns:nombrePaciente"],
                          valor : v["ns:valor"],
                          totalBonif : v["ns:totalBonif"],
                          bonifSeleccionada : v["ns:montoEfectivo"],
                          copago : v["ns:copago"],
                      };
       
            cargaDatos2[incrementa] = cargaDatos;
            incrementa++
        }

      } 

     if(vm.servicioLocal.detalleTipoPagoSeleccionado == 2){

        if(v["ns:montoCheque"] != 0){
        
            cargaDatos = { 
                          idAtencion : v["ns:idAtencion"], 
                          nomTipoPago : "CHEQUE",      
                          numeroBono : v["ns:numeroBono"],
                          fechaBono : v["ns:fechaBono"],
                          rutBenef : v["ns:rutBenef"],
                          nombrePaciente : v["ns:nombrePaciente"],
                          valor : v["ns:valor"],
                          totalBonif : v["ns:totalBonif"],
                          bonifSeleccionada : v["ns:montoCheque"],
                          copago : v["ns:copago"],
                      };
       
            cargaDatos2[incrementa] = cargaDatos;
            incrementa++
        }

      }

      if(vm.servicioLocal.detalleTipoPagoSeleccionado == 3){

        if(v["ns:montoExcedente"] != 0){
                   
            cargaDatos = { 
                          idAtencion : v["ns:idAtencion"], 
                          nomTipoPago : "EXCEDENTE",      
                          numeroBono : v["ns:numeroBono"],
                          fechaBono : v["ns:fechaBono"],
                          rutBenef : v["ns:rutBenef"],
                          nombrePaciente : v["ns:nombrePaciente"],
                          valor : v["ns:valor"],
                          totalBonif : v["ns:totalBonif"],
                          bonifSeleccionada : v["ns:montoExcedente"],
                          copago : v["ns:copago"],
                      };

         
       
            cargaDatos2[incrementa] = cargaDatos;
            incrementa++
            
        }

      }


      if(vm.servicioLocal.detalleTipoPagoSeleccionado == 4){


        if(v["ns:montoIsapre"] != 0){
          
            cargaDatos = { 
                          idAtencion : v["ns:idAtencion"], 
                          nomTipoPago : "ISAPRE",      
                          numeroBono : v["ns:numeroBono"],
                          fechaBono : v["ns:fechaBono"],
                          rutBenef : v["ns:rutBenef"],
                          nombrePaciente : v["ns:nombrePaciente"],
                          valor : v["ns:valor"],
                          totalBonif : v["ns:totalBonif"],
                          bonifSeleccionada : v["ns:montoIsapre"],
                          copago : v["ns:copago"],
                      };
       
            cargaDatos2[incrementa] = cargaDatos;
            incrementa++
        }

      } 

     if(vm.servicioLocal.detalleTipoPagoSeleccionado == 5){

        if(v["ns:montoSeguro"] != 0){
        
            cargaDatos = { 
                          idAtencion : v["ns:idAtencion"], 
                          nomTipoPago : "SEGURO",      
                          numeroBono : v["ns:numeroBono"],
                          fechaBono : v["ns:fechaBono"],
                          rutBenef : v["ns:rutBenef"],
                          nombrePaciente : v["ns:nombrePaciente"],
                          valor : v["ns:valor"],
                          totalBonif : v["ns:totalBonif"],
                          bonifSeleccionada : v["ns:montoSeguro"],
                          copago : v["ns:copago"],
                      };
       
            cargaDatos2[incrementa] = cargaDatos;
            incrementa++
        }

      }

      if(vm.servicioLocal.detalleTipoPagoSeleccionado == 6){

        if(v["ns:montoCaja"] != 0){
                   
            cargaDatos = { 
                          idAtencion : v["ns:idAtencion"], 
                          nomTipoPago : "CAJA",      
                          numeroBono : v["ns:numeroBono"],
                          fechaBono : v["ns:fechaBono"],
                          rutBenef : v["ns:rutBenef"],
                          nombrePaciente : v["ns:nombrePaciente"],
                          valor : v["ns:valor"],
                          totalBonif : v["ns:totalBonif"],
                          bonifSeleccionada : v["ns:montoCaja"],
                          copago : v["ns:copago"],
                      };
         
            cargaDatos2[incrementa] = cargaDatos;
            incrementa++
            
        }

      }    


    });

   //console.log(u);
    vm.servicioLocal.datosDetalleCajaMedioPago = [];
    vm.servicioLocal.datosDetalleCajaMedioPago = cargaDatos2; 
    $state.go('detalleCajaMedioPago');


   
  } 


 
});

 