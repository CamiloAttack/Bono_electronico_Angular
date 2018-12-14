(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name medipassBE.controller:RamController
     * @description
     * # RamController
     * Controller of the medipassBE
     */
    angular.module('medipassBE')
        .controller('RamController', RamController);
    RamController.$inject = ['$http','$scope', '$state', '$stateParams', 'verificadorConexion', 'servicioLocal', '$window', '$timeout','servicioMilliways','$localStorage','$sessionStorage','_'];

    function RamController($http,$scope, $state, $stateParams, verificadorConexion, servicioLocal, $window, $timeout,servicioMilliways,$localStorage,$sessionStorage,ngMessages,_) {



        var vm = this;
        vm.disabled = undefined;
        vm.convenio = '';
        vm.state = $state.current.name; 
   
        $scope.rut = '';

        vm.stateParams = $stateParams;
        vm.verificadorConexion = verificadorConexion;
     
        vm.atencion = servicioLocal.atencion;
        vm.datosSesion = servicioLocal.datosSesion;
        vm.servicioMilliways = servicioMilliways;
        vm.servicioLocal = servicioLocal;
        var $scope;
        vm.prestaciones = vm.servicioLocal.prestaciones;
        vm.medicos =vm.servicioLocal.medicos;
        vm.especialidad =vm.servicioLocal.ArraycodigoEspecialidad;        
        vm.items = servicioLocal.items;
        vm.ges = servicioLocal.ges;
        vm.tipoAtenciones = servicioLocal.tipoAtenciones;
        vm.consulta = false;
        vm.cambioAdevolver = 0;
        vm.ges = [{"id":1,"codigo":"","nombre":"CODIGO GES"}];
        vm.pago = {  
            monto: null,
            numeroCheque: null, 
            numeroSerieCheque: null, 
            rutTitular: null,  
            nombreTitular: null,  
            codigoBanco: null,  
            nombreBanco: null,  
            tipoTarjeta: null,  
            numeroTargeta: null,  
            numeroPagare: null,  
            telefonoTitular: null,  

        };

        vm.form = { 
       
            item: {
                selected: vm.items[0],
            },
            codigoGes: {
                selected: vm.ges[0],
            },
        };  

 
        vm.conXlc = false;  
        vm.changedValueCodigoEspecialidad = function(valores){

 
          var filtraPorcodigoMedico = [];      
 
          angular.forEach(vm.medicos,function(v,k){
                      
            if(v.codigoEspecialidad == valores.codigoEspecialidad){
 
              filtraPorcodigoMedico[k] = v;
 
            }

          });

          vm.medicos =  filtraPorcodigoMedico;

          var filtraPorEspecialidad = [];
 
          vm.especialidad = [valores];

            if(valores.codigoEspecialidad == "XLC"){
                vm.mensajeConvenio = "Prestaciones codigo especialidad  " + valores.codigoEspecialidad;   
              $("#nombreDerivado").addClass("shadow_rojo").attr("disabled",false);                
              $("#notificaciondiv").addClass("roj-roj").removeClass("nar-nar");    
              $("#notificaciondiv").css("display","block"); 
              vm.conXlc = true;  
            }else{
   
              vm.conXlc = false;  
              $("#nombreDerivado").removeClass("shadow_rojo").attr("disabled",true);                      
              $("#notificaciondiv").css("display","none");

            }
        }
  
        vm.changedValueMedicoEspecialidad = function(){

            vm.conXlc = true; 

            if($("#nombreDerivado").val()){

                vm.conXlc = false; 

            }
 

        }

        vm.changedValueMedico = function(valores){

            var filtraPorcodigoMedico = [];
      
            angular.forEach(vm.medicos,function(v,k){
                         
                if(v.codigoMedico == valores.codigoMedico){
                       
                    filtraPorcodigoMedico[k] = v;
     
                }


             });

            vm.medicos = filtraPorcodigoMedico;
            var filtraPorEspecialidad = [];
 
      
            angular.forEach(vm.especialidad,function(v,k){
                  
                         
                if(v.codigoMedico == valores.codigoMedico){
                       
                    filtraPorEspecialidad[k] = v;
     
                }


             });

            vm.especialidad = filtraPorEspecialidad;


       }
     
 
        var Fn = {
           
            validaRut : function (rutCompleto) {
                if (!/^[0-9]+-[0-9kK]{1}$/.test( rutCompleto ))
                    return false;
                var tmp     = rutCompleto.split('-');
                var digv    = tmp[1]; 
                var rut     = tmp[0];
                if ( digv == 'K' ) digv = 'k' ;
                return (Fn.dv(rut) == digv );
            },
            dv : function(T){
                var M=0,S=1;
                for(;T;T=Math.floor(T/10))
                    S=(S+T%10*(9-M++%6))%11;
                return S?S-1:'k';
            }
        }

 
        vm.agregarPrestacion = function () {
    
            
          vm.form.cantidad  = $("#cantidad").val();
 
      
          vm.disabled = true

 
          $("#nombreDerivado").attr("disabled",true).removeClass("shadow_rojo");            

            var numeroRow;
            var medicoDerivado = vm.form.derivado;

            if(!vm.form.derivado){

                medicoDerivado = 0;

        }

/* -------------------Incremento si agrego la misma prestacion mas de una vez---------------------------*/

            angular.forEach(vm.atencion.datosPrestaciones,function(v,k){


                if(vm.form.prestacion.selected.id == v.idPrestacion){
                     
                    vm.form.cantidad = parseInt(vm.form.cantidad) + parseInt(v.cantidad); // incremento la cantidad 

                    vm.atencion.datosPrestaciones.splice(k, 1); // elimino la prestacion anterior que es igual
                    vm.atencion.datosPrestacionesValorizar.splice(k, 1);// elimino la prestacion anterior que es igual
                    vm.atencion.datosPrestacionesComprobante.splice(k, 1);   // elimino la prestacion anterior que es igual
                    vm.atencion.datosCargaEnvioBono.splice(k, 1);// elimino la prestacion anterior que es igual
                    vm.atencion.datosPrestacionesInsert.splice(k, 1);// elimino la prestacion anterior que es igual


                }

            });

// -------------------FIN      Incremento si agrego la misma prestacion mas de una vez--------------------FIN
         
 
            vm.prestacion = { // VALORES OBTENIDOS DE FORMULARIO
                idPrestacion: vm.form.prestacion.selected.id, //siempre
                codigo: vm.form.prestacion.selected.codigoPrestacion, //siempre
                nombre: vm.form.prestacion.selected.nombrePrestacion,
                cantidad: vm.form.cantidad, //siempre
                idItem: vm.form.item.selected.id, //siempre
                codigoItem: vm.form.item.selected.codigo, //siempre
                idCodigoGes: vm.form.codigoGes.selected.id,
                codigoGes: vm.form.codigoGes.selected.codigo,
                recargo: vm.recargo(),
                valorPrestacion: vm.valorPrestacion(), //siempre
                copago: vm.valorPrestacion(),

                idMedico: vm.form.medico.selected.id,
                nombreMedico:vm.form.medico.selected.nombreMedico,
                codigoMedico:vm.form.medico.selected.codigoMedico,
                codigoEspecialidad:vm.form.especialidad.selected.codigoEspecialidad,
                idEspecialidad: vm.form.especialidad.selected.idEspecialidad,
                nombreEspecialidad:vm.form.especialidad.selected.nombreEspecialidad,
                medicoDerivado: medicoDerivado,
                nombre_isapre:vm.servicioLocal.datosPaciente.isapre,
                numeroConvenio:vm.form.prestacion.selected.numeroConvenio,
    
            };

/*---------------------------------------------------
                diferencia ??????

                idCodigoGes: vm.form.codigoGes.selected.id,??????
                codigoGes: vm.form.codigoGes.selected.codigo,?????  */

//-----------------------------------------FILTROS DE SELECT -------------------------------------------- 
        var filtraPorConvenio = [];
        angular.forEach(vm.prestaciones,function(v,k){
         
          if(typeof v !== 'undefined'){
                  
            if(v.numeroConvenio == vm.form.prestacion.selected.numeroConvenio){
                     
              filtraPorConvenio[k] = v;

            } 
         

          }         


        });
        vm.prestaciones = filtraPorConvenio;


        


//-----------------------------------------FIN FILTROS DE SELECT -------------------------------------------- FIN       
        // variables para enviarBono

        vm.servicioLocal.numeroConvenio =  vm.form.prestacion.selected.numeroConvenio;
        vm.servicioLocal.lugarConvenio =  vm.form.prestacion.selected.lugaratencionHomologo;
        vm.servicioLocal.sucursalVenta =  vm.form.prestacion.selected.sucursalHomologo;       
        vm.servicioLocal.rutConvenio = vm.form.prestacion.selected.rutConvenio; 
        vm.servicioLocal.rutMedico = vm.form.medico.selected.rutMedico;
        vm.servicioLocal.codigoEspecialidad = vm.prestacion.codigoEspecialidad;
        vm.servicioLocal.nombreAcompanante = vm.servicioLocal.datosPaciente.nombreAcompanante;
        vm.servicioLocal.numeroConvenio = vm.form.prestacion.selected.numeroConvenio;

    if(vm.atencion.datosAtencion.tipoAtencion == "PARTICULAR"){

      var prestacionInsert =  {

                        "urn:idPrestacion":vm.form.prestacion.selected.id,
                        "urn:idConvenioPrestacion":1,
                        "urn:idEspecialidad":vm.form.especialidad.selected.idEspecialidad,
                        "urn:idMedico":vm.form.medico.selected.id,
                        "urn:item":vm.form.item.selected.id,
                        "urn:ges":vm.form.codigoGes.selected.codigo,
                        "urn:rh":0,
                        "urn:cantidad":vm.form.cantidad,
                        "urn:monto":vm.valorPrestacion(),
                        "urn:bonificacion":0,
                        "urn:copago":vm.valorPrestacion(),
                        "urn:medicoDerivado": medicoDerivado,                        
                  }

    }else{
        

          $(".tool-tip").css("display","block");

          if(!vm.form.prestacion.selected.numeroConvenio){

              vm.mensajeConvenio = vm.servicioLocal.datosMensaje.no_convenio_prestacion;
              $("#notificaciondiv").addClass("roj-roj").removeClass("nar-nar");            

          }else{

              vm.mensajeConvenio = "solo prestaciones en convenio " + vm.form.prestacion.selected.numeroConvenio;
              $("#notificaciondiv").addClass("nar-nar").removeClass("roj-roj");
          }
   
          $("#notificaciondiv").css("display","block");
   

            
          var prestacionInsert = {

                                   "urn:idPrestacion":vm.form.prestacion.selected.id,
                                   "urn:idConvenioPrestacion":1,
                                   "urn:idEspecialidad":vm.form.especialidad.selected.idEspecialidad,
                                   "urn:idMedico":vm.form.medico.selected.id,
                                   "urn:item":vm.form.item.selected.id,
                                   "urn:ges":vm.form.codigoGes.selected.codigo,
                                   "urn:rh":0, //????? ver xml en word 
                                   "urn:cantidad":vm.form.cantidad,

                                   //????   diferencia entre estos 3 datos

                                   "urn:monto":0, // monto
                                   "urn:montoBonificacion":0, // bonificacion 
                                   "urn:bonificacion":0,

                                   //????  Fin  diferencia entre estos 3 datos


                                   "urn:copago":vm.copago(vm.valorPrestacion(), vm.recargo(), vm.form.cantidad),
                                   "urn:medicoDerivado":medicoDerivado,// validar si esta o no
                                    "urn:idEntidad":4, // 4 es de consalud 
                                   "urn:idEstatus":6, // verificar en tabla estatus cual id corresponde 
                              
                                   "urn:numeroBono":0,  // se pisa en servicio SolicitarFolio
                                   "urn:glosa":1,
                                   "urn:tipoBonificacion":1,   

                                } 

        var prestacionEnvioBono= {

                                    "urn:codigoPrestacion":vm.form.prestacion.selected.id,
                                    "urn:tipoPrestacion":"tipoPrestacionUnspecified",
                                    "urn:codigoAdicionalPrestacion":vm.form.prestacion.selected.codigoPrestacion,
                                    "urn:recargoFueraHorario":"false",
                                    "urn:cantidad":vm.form.cantidad,
                                    "urn:valorPrestacion":"0", // se pisa en servicio valorizarPrestacion
                                    "urn:aporteFinanciador":"0", // se pisa en servicio valorizarPrestacion
                                    "urn:copago":"0",  // se pisa en servicio valorizarPrestacion
                                    "urn:internoIsapre":"0", 

                                } 



    }



            vm.formularioPrestacion.$setPristine();

            vm.atencion.datosPrestaciones.push(vm.prestacion);// prestaciones en vista de atencion (dode se elijen las prestaciones)

            vm.atencion.datosPrestacionesParticular.push(vm.prestacion);

            vm.atencion.datosPrestacionesComprobante.push(vm.prestacion);// array modificado para el comprobante a imprimir 

            vm.atencion.datosPrestacionesInsert.push(prestacionInsert);  // agrego datos con las variable necesarias para el servicio insert

            vm.atencion.datosCargaEnvioBono.push(prestacionEnvioBono);// agrego datos con las variable necesarias para el servicio enviarBono


            var fechaServidorDesde = vm.form.prestacion.selected.recargoHoraDesde.substring(0,15);
            var resultadoHoraDesde=vm.form.prestacion.selected.recargoHoraDesde.substring(9,17); 

            var fechaServidorHasta = vm.form.prestacion.selected.recargoHoraHasta.substring(0,15);
            var resultadoHoraHasta=vm.form.prestacion.selected.recargoHoraHasta.substring(9,17); 


            var segMinHorDesde = resultadoHoraDesde.split(":");

            var unixDesde =  moment("2015-07-15"+resultadoHoraDesde).unix();

            var unixHasta =  moment("2018-07-15"+resultadoHoraHasta).unix();
                       
            vm.atencion.datosPrestacionesValorizar.push({

                                                        "unixDesde": unixDesde,
                                                        "unixHasta": unixHasta,                                                        
                                                        "codigo":"0000"+vm.prestacion.codigo,
                                                        "tipo":0,
                                                        "codigoAdicional":"0"+vm.prestacion.codigo,
                                                        "recargoFueraHorario":0,
                                                        "cantidad":"0"+vm.prestacion.cantidad,
                                                        "valor":"000000000000",

                                                        });
            

            if (vm.state !== 'simulacion') {
                if (vm.atencion.datosAtencion.tipoAtencion === 'PARTICULAR') {
                    vm.atencion.datosAtencion.estadoAtencion = 'VALORIZADA';
                } else {
                    vm.atencion.datosAtencion.estadoAtencion = 'NUEVA';
                }
            }
// ------------------------------Calculo el valor de estas dos variables--------------------------
            var    totalPrestacion = 0;
            var    totalCopagos = 0;

            angular.forEach(vm.atencion.datosPrestaciones,function(v,k){

                totalPrestacion =  parseInt(totalPrestacion) +  parseInt(v.valorPrestacion);
                totalCopagos =  parseInt(totalCopagos) +  parseInt(v.copago);
                
            });

            vm.atencion.datosPago.totales.montoIsapre = 0;
            vm.atencion.datosPago.totales.total = totalPrestacion;
            vm.atencion.datosPago.totales.copago = totalCopagos; 
   
// --FIN--------------------------Calculo el valor de estas dos variables-------------------------FIN

// -------------------------Oculto botones segun corresponda-----------------------------------------
            if (vm.atencion.datosAtencion.tipoAtencion === 'ONLINE') {

                $("#id_btn_valorizar_online").css("display","block");
                $("#id_btn_pagar_online").css("display","none").removeAttr("disabled");                

            }else{

                $("#id_btn_pagar_online").css("display","block").removeAttr("disabled");
            }   
// -FIN----------------------Oculto botones segun corresponda---------------------------------------FIN
        };

        vm.removeRowPrestaciones = function (row) { //quita  Prestaciones agregadas 

            var index = vm.atencion.datosPrestaciones.indexOf(row);
            if (index !== -1) {
                vm.atencion.datosPrestaciones.splice(index, 1);
                vm.atencion.datosPrestacionesValorizar.splice(index, 1);
                vm.atencion.datosPrestacionesComprobante.splice(index, 1);   
                vm.atencion.datosCargaEnvioBono.splice(index, 1);
                vm.atencion.datosPrestacionesInsert.splice(index, 1);

             
                if (vm.state !== 'simulacion') {
                    if (vm.atencion.datosAtencion.tipoAtencion === 'PARTICULAR') {
                        vm.atencion.datosAtencion.estadoAtencion = 'VALORIZADA';
                    }
                } else {

                    vm.atencion.datosAtencion.estadoAtencion = 'NUEVA';
                }

            // recorro vm.atencion.datosPrestaciones para calcular el nuevo total 
                var    totalPrestacion = 0;
                var    totalCopagos = 0;
                var     totalAporteFinanciador= 0;

                angular.forEach(vm.atencion.datosPrestaciones,function(v,k){

                    totalPrestacion =  parseInt(totalPrestacion) +  parseInt(v.valorPrestacion);
                    totalCopagos =  parseInt(totalCopagos) +  parseInt(v.copago);
                    totalAporteFinanciador = parseInt(totalAporteFinanciador) + parseInt(v.aporteFinanciador);
                     
                });

                vm.atencion.datosPago.totales.montoIsapre =  totalAporteFinanciador;  
                vm.atencion.datosPago.totales.total = totalPrestacion;
                vm.atencion.datosPago.totales.copago = totalCopagos;
            //FIN---recorro vm.atencion.datosPrestaciones para calcular el nuevo total-----------FIN                 

            }
 
            if(vm.atencion.datosPrestaciones.length == 0){

                $("#id_btn_valorizar_online").css("display","none");
                $("#id_btn_pagar_online").css("display","none");
                $("#notificaciondiv").css("display","none");
                $("#nombreDerivado").removeAttr("disabled").addClass("shadow_rojo").val("");
                vm.disabled = false;


                setTimeout(function(){
       
                  vm.prestaciones = vm.servicioLocal.prestaciones;
                  vm.medicos =vm.servicioLocal.medicos;
                  vm.especialidad =vm.servicioLocal.ArraycodigoEspecialidad;  

                },100)


            }
            console.log(vm.atencion.datosPrestacionesValorizar);
            console.log(vm.atencion.datosPrestacionesInsert);

        };


          vm.valorizarPrestacionesRam = function(){

              vm.prestaciones = undefined;

             /* $("#prestacion .ng-binding").text("CODIGO DE PRESTACION - PRESTACION").addClass("refresh_placeholder").css("color","#666");

              $(".refresh_placeholder").eq(2).text("");      */

              setTimeout(function(){

                vm.prestaciones = vm.servicioLocal.prestaciones; 

              },100);


        

              $("#cantidad").val(1);
      

              vm.servicioMilliways.valorizarPrestaciones();

          }


 
        /**
         * Funcion que inicializa el controlador
         * determino si es una consulta o no
         */
        

        var init = function () {

 
            if (vm.state !== 'simulacion') {
                vm.showPago = false;
                vm.showConfirmacion = false;
                if (vm.atencion._id) {

                } else {

                    vm.atencion.datosAtencion.estadoAtencion = 'NUEVA';
   
                    if (vm.servicioLocal.datosPaciente.bonificaion == false ) {

                        vm.atencion.datosAtencion.tipoAtencion = 'PARTICULAR';

                        vm.atencion.datosBeneficiario.nombre = vm.servicioLocal.datosPaciente.nombre;

                        vm.atencion.datosBeneficiario.apellidoPaterno = vm.servicioLocal.datosPaciente.apellidoPaterno;

                        vm.atencion.datosBeneficiario.apellidoMaterno = vm.servicioLocal.datosPaciente.apellidoMaterno;

                        vm.atencion.datosBeneficiario.rut = vm.servicioLocal.datosPaciente.rut;

                        vm.atencion.datosTitular.nombre = vm.servicioLocal.datosPaciente.nombrenombreCotizante
   

                        vm.atencion.datosTitular.rut = vm.servicioLocal.datosPaciente.rutCotizante;                        


                    }else{

                        vm.atencion.datosAtencion.tipoAtencion = 'ONLINE';

                        vm.atencion.datosBeneficiario.nombre = vm.servicioLocal.datosPaciente.nombre;

                        vm.atencion.datosBeneficiario.apellidoPaterno = vm.servicioLocal.datosPaciente.apellidoPaterno;

                        vm.atencion.datosBeneficiario.apellidoMaterno = vm.servicioLocal.datosPaciente.apellidoMaterno;

                        vm.atencion.datosBeneficiario.rut = vm.servicioLocal.datosPaciente.rut;

                        vm.atencion.datosTitular.nombre = vm.servicioLocal.datosPaciente.nombreCotizante;

                        vm.atencion.datosTitular.rut = vm.servicioLocal.datosPaciente.rutCotizante;   

                    }

                }

                if (!vm.atencion.datosIsapre.nombre) {
                    vm.tieneIsapre = false;

                } else {
                    vm.tieneIsapre = true;
                }

                vm.tipoAtencion = vm.atencion.datosAtencion.tipoAtencion;             
            }
        };

        // and fire it after definition

        $scope.$watch('vm.verificadorConexion.isOnline()', function (online) {
            vm.onlineStatusString = online ? 'ONLINE' : 'OFFLINE';
            if (vm.tipoAtencion !== 'PARTICULAR') {
                vm.tipoAtencion = vm.onlineStatusString;
                console.log(vm.tipoAtencion);
                console.log("vm.tipoAtencion");
            }
        });
   


        //calcular el valor de la prestacion
        vm.valorPrestacion = function () {
            return vm.form.prestacion.selected.precioBase * vm.form.cantidad;
        };

        vm.valorizar = function () {
            if (vm.state !== 'simulacion') {
                vm.atencion.datosAtencion.estadoAtencion = 'VALORIZADA';
            }
        };

 
        vm.divideArrayComprobante = function (){


            var cargaDatosComprobante =[];            
            var chunk;
            var incrementa = 0;


            while (vm.atencion.datosPrestacionesComprobante.length > 0) {  //----while para modelar el array por cada 6 prestaciones

                chunk = vm.atencion.datosPrestacionesComprobante.splice(0,6);
                cargaDatosComprobante[incrementa] = chunk;
               
                incrementa++;

            } //--------------------------------------------------------------Fin ---while para modelar el array por cada 6 prestaciones

// ---------------------SE CALCULA LOS  TOTALES POR CADA COMPROBANTE (BONO)--------------------------------------------
            var totalCopagoComprobante = 0;
            var totaldatosBonificacion = 0;
            var totalMontoComprobante  = 0; 

            var cambia_en_foreach = 0;// variable compara si k cambio para poner en  0 el valor de las variables que suman las cantidades totales , 
                                        // de esta forma no conservo el valor de la variable del total de las prestaciones del bono anterior ya recorrido. 

            angular.forEach(cargaDatosComprobante,function(v,k){ 

                if(cambia_en_foreach != k){ // verifico cambio 

                    cambia_en_foreach = k;
                    totalCopagoComprobante = 0;
                    totaldatosBonificacion = 0;
                    totalMontoComprobante  = 0;

                }

                angular.forEach(v,function(vv,kk){ // recorro los respectivos mostos de la prestacion
                    // sumo los montos y los dejo en su total  
                    vm.atencion.datosCopagoTotales[k] = totalCopagoComprobante = parseInt(totalCopagoComprobante) + parseInt(vv.copago);
                    vm.atencion.datosBonificacionTotales[k] = totaldatosBonificacion = parseInt(totaldatosBonificacion) + parseInt(vv.aporteFinanciador);
                    vm.atencion.totalMontoComprobante[k] = totalMontoComprobante = parseInt(totalMontoComprobante) + parseInt(vv.valorPrestacion);
                });        

            });

// -----------------FIN--------------------------SE CALCULA LOS  TOTALES POR CADA COMPROBANTE (BONO)-------------------------------------------- FIN -------------------

            vm.atencion.datosPrestacionesComprobante.push(cargaDatosComprobante); // creo el array que luego se itera en la vista html que muestra el bono
            
            var cargaDatosComprobanteImprimir = [];
            var incrementoPar=-2;
            var incrementoImpar=-1;

            angular.forEach(cargaDatosComprobante,function(v,k){

                incrementoPar+=2;
                incrementoImpar+=2;

                v["index_no_repite"] = k;
                cargaDatosComprobanteImprimir[incrementoPar] = v;         
                cargaDatosComprobanteImprimir[incrementoImpar] = v;
         
            });
  
            vm.atencion.datosPrestacionesComprobanteImprimir.push(cargaDatosComprobanteImprimir); 

        
        };


        vm.divideArrayInsertAtenciones = function(){


            var cargaDatosInsert =[];            
            var chunkInsert;
            var incrementaInsert = 0;


            while (vm.atencion.datosPrestacionesInsert.length > 0) {  //----while para modelar el array por cada 6 prestaciones

                chunkInsert = vm.atencion.datosPrestacionesInsert.splice(0,6);
                cargaDatosInsert[incrementaInsert] = chunkInsert;
               
                incrementaInsert++;

            } //Fin ---while para modelar el array por cada 6 prestaciones


            vm.atencion.datosPrestacionesInsert.push(cargaDatosInsert); // creo el array que luego se modela para el envio de datos en servicio Insert
        
           
            vm.servicioMilliways.solicitarFolio( vm.atencion.datosPrestacionesComprobante[0].length); // traigo los folio  y cambio el avalor de "urn:numeroBono" de cada prestacion por cada bono
    

        };



        vm.divideArrayEnviarBono = function(){


            var cargaDatosEnvioBono =[];            
            var chunkEnvioBono;
            var incrementaEnvioBono = 0;


            while (vm.atencion.datosCargaEnvioBono.length > 0) {  //----while para modelar el array por cada 6 prestaciones

                chunkEnvioBono = vm.atencion.datosCargaEnvioBono.splice(0,6);
                cargaDatosEnvioBono[incrementaEnvioBono] = chunkEnvioBono;
               
                incrementaEnvioBono++;

            } //Fin ---while para modelar el array por cada 6 prestaciones

            vm.atencion.datosCargaEnvioBono.push(cargaDatosEnvioBono); // creo el array que luego se modela para el envio de datos en enviarBno


        };
 
        vm.pagar = function () {
           
          
            vm.divideArrayComprobante(); // Ejecuto funcion 
            vm.divideArrayInsertAtenciones(); // Ejecuto funcion 
            vm.divideArrayEnviarBono();// Ejecuto funcion 

            vm.atencion.datosAtencion.estadoAtencion = 'POR PAGAR';
            vm.showPago = true;
            vm.showConfirmacion = false;
            $state.go('ram.pago');

            vm.pago = {
                monto: vm.atencion.datosPago.totales.copago,
            };
 
        };

        //calcular si hay recargo y cuanto es el monto
        vm.recargo = function () {
            var evalTime = moment();

            var extra = moment().format('YYYY-MM-DD') + ' ';

            var start_time = moment(extra + "00:00:00,000000");
            var end_time = moment(extra + "24:00:00,000000");    

            if (moment(evalTime).isBetween(start_time, end_time)) {

                if (vm.datosSesion.recargoTipo == 'PORCENTAJE') {
                    return vm.datosSesion.recargoMonto * vm.valorPrestacion() / 100;
                }

                if (vm.datosSesion.recargoTipo == 'MONTO') {
                    return vm.datosSesion.recargoMonto;

                }
            } else {
                return 0;
            }

        };

        vm.copago = function (a, b, c) {
            return (a + b) * c;
        };

        vm.totalCantidad = function () {
            if (!vm.tieneIsapre) {
                var total = 0;
                angular.forEach(vm.atencion.datosPrestaciones, function (prestacion) {

                    total = parseInt(prestacion.cantidad) + parseInt(total);
                });

                return total;
            } else {
                return vm.atencion.datosIsapre.numeroPrestaciones;

            }
        };

        /**
         * Funcion que calcula el total
         */
        vm.totalMonto = function () {
            if (!vm.tieneIsapre) {
                var total = 0;
                angular.forEach(vm.atencion.datosPrestaciones, function (prestacion) {

                    total += prestacion.valorPrestacion;
                });

                return total;
            } else {

                return vm.atencion.datosPago.totales.total;

            }
        };

        /**
         * Funcion que observa la variable pago.monto para calcular el cambio a devolver
         */
        $scope.$watch('vm.atencion.datosPago.totales.montoExcedenteUsado', function (value) {

            if( value > vm.atencion.datosPago.totales.montoExcedentePendiente){ // si el valor agregado para es mayor qeu lo pendiente 
             
       
                vm.atencion.datosPago.totales.montoExcedenteUsado = vm.atencion.datosPago.totales.montoExcedentePendiente;

            }

        });



        $scope.$watch('vm.pago.monto', function (value) {

         
            if ( value === 0) {  // verifico que sea un valor entero positivo        
     
                vm.cambioAdevolver = 0; 
                $("#efectivo_efectivo").attr("disabled",true); 
          
            }
            if (isNaN(value)) {  // verifico que sea un valor entero positivo        
 
                vm.cambioAdevolver = 0; 
                $("#efectivo_efectivo").attr("disabled",true); 
          
            }              

            if( value > vm.totalPendiente() ){ // si el valor agregado para es mayor qeu lo pendiente 

                vm.cambioAdevolver  = parseInt(value) -  parseInt(vm.totalPendiente() );
                vm.pago.monto = vm.totalPendiente();
                $("#efectivo_efectivo").attr("disabled",false);

            }
            if( value < vm.totalPendiente() && value !== 0 ){ // si el valor agregado para pagar es mayor qeu lo pendiente 
 
                vm.cambioAdevolver = 0;
                $("#efectivo_efectivo").attr("disabled",false);
            }

        });


        /**
         * Funcion que calcula el copago dependiendo si tiene isapre o no
         */
        vm.totalCopago = function () {
            if (!vm.tieneIsapre) {

                var total = 0;
                angular.forEach(vm.atencion.datosPrestaciones, function (prestacion) {
                    total += prestacion.copago;
                });

                return total;
            } else {
                return vm.atencion.datosPago.totales.copago;
            }

        };

      //  vm.servicioLocal.datosPaciente.montoExcedentePendiente = vm.atencion.datosPago.totales.copago; 
        vm.generaArrayInsertFinal = function(){    

            var arrayLLenaParaInsert = [];
 
            var rutTitularChequeNumero= "000000000";
            var rutTitularChequeDV= "0";
            var incrementa = 0; 
            var numeroBonoSegunTipoAtencion;

 

            angular.forEach(vm.atencion.datosPrestacionesInsert[0],function(v,k){

                incrementa++


          if(vm.atencion.datosAtencion.tipoAtencion == "PARTICULAR"){

            vm.atencion.datosFolio[k] = parseInt(k) + 1;
            vm.atencion.datosBonificacionTotales[k] = 0;

          }
            
                arrayLLenaParaInsert.push(

                                            {           

                                                "urn:numeroBono":vm.atencion.datosFolio[k], // incrementa por bono numero interno de equipo
                                                "urn:totalPrestacion": vm.atencion.totalMontoComprobante[k],
                                                "urn:montoIsapres":vm.atencion.datosBonificacionTotales[k],                                               
                                                "urn:montoSeguro":0,
                                                "urn:montoCaja":0,
                                                "urn:totalBonificacion":vm.atencion.datosBonificacionTotales[k], // despues este se cambia cundo este caja y seguro
                                                "urn:copago":vm.atencion.datosCopagoTotales[k],
                                                "urn:codigoAtencion":1,// 
                                                "urn:usoExcedente":vm.servicioLocal.atencion.totalExedenteComprobante[k],
                                                "urn:numeroOperacion":incrementa,  // incrementa por bono numero interno de equipo - nueva definición javier 30-06-2016 antes era este valor vm.atencion.datosFolio[k]  
                                            },

                                            {
                                                "urn:montoEfectivo":vm.pago.montoPagoEfectivo,
                                                "urn:montoCheque":vm.pago.montoPagoCheque,
                                                "urn:montoExcedente":vm.servicioLocal.atencion.totalExedenteComprobante[k],
                                                "urn:montoCCAF":"0",
                                                "urn:montoTarjetaCredito":"0",
                                                "urn:montoTarDebito":"0",
                                                "urn:montoISAPRES":vm.atencion.datosBonificacionTotales[k],                            
                                                "urn:montoSeguro":"0",
                                                "urn:montoCaja":"0",
                                                "urn:copago":vm.atencion.datosCopagoTotales[k],
                                                "urn:numeroPagare":"0",
                                                "urn:idBanco":"0",
                                                "urn:numeroCheque":"0",
                                                "urn:numeroSerieCheque":"0",
                                                "urn:rutTitularChequeNumero":"000000000",
                                                "urn:rutTitularChequeDV":"0",                           
                                                "urn:telefonoCheque":"0",         
                                            },
                         
                                            angular.forEach(v,function(vv,kk){

                                              
                                                 
                                            })  
 
                                        )// FIN -------------arrayLLenaParaInsert.push(
                            })
 

            var cargaDatosInsert =[];            
            var chunkInsert;
            var incrementaInsert = 0;

            while (arrayLLenaParaInsert.length > 0) {  //----while para modelar el array por cada 6 prestaciones

                chunkInsert = arrayLLenaParaInsert.splice(0,3);
                cargaDatosInsert[incrementaInsert] = chunkInsert;
               
                incrementaInsert++;
            }    
 
            vm.atencion.datosEnvioPrestacionesInsert.push(cargaDatosInsert);  
          
        };

        var $scope;  
        vm.seleccionTipoPago = function ($scope) { // funcion para lista desplegable de los tipos de pago

            vm.myDropDown = '0';

        };

 

 


 // fin validaciones-----------------------------------pagos------------------------------------------------------      
 
 

         /**
         * Funcion que agrega el pago en la pantalla pago
         */
        vm.agregaRowMediosPago =[];  // array para  agregar valores de medios de pago a mostrar en pantalla (Medios de pago  y monto)
        var incrementaRowAgregar = 0;

        var medioPagoCheque = false; 
        var medioPagoExcedente = false;
        var medioPagoEfectivo = false; // abajo lo valido ya que el medio de pago en efectivo solo es una vez         
        //-FIN--------variables para validar-------

       //----------variables para de montos-------
        var montoPagoEfectivo = 0;
        var montoPagoCheque = 0;
        var montoPagoExcedente = 0;
        var montoExcedentePendiente = 0;   
        var montoTotalPagado = 0;



        vm.agragarPago= function () {

        var pagoRowAgregar ={};  // objeto que se agrega en  vm.agregaRowMediosPago   con  medios de pago y monto 


         if (incrementaRowAgregar == 1){
          incrementaRowAgregar = 0;
          return false;
         }
 
           
              var vacio = true;

//----VALIDACIONES----
                switch ($("#for-pag").val()) { // switch para validar el tipo de pago con respectivos campos
                    case 'CHEQUE':
                        {
                          
 
                            if($("#id_cheque_numero").val() == ""){

                              vacio = false;
                              $("#id_cheque_numero_error").text("Falta el n° de cheque"); 
                              
                            }else if(isNaN($("#id_cheque_numero").val())){ // si tiene tecto

                              vacio = false;
                               
                              $("#id_cheque_numero_error").text("El n° de cheque solo debe contener números");   

                            }else{

                              $("#id_cheque_numero_error").text(""); 

                            }



                            if($("#id_cheque_serie").val() == ""){

                              vacio = false;
                              $("#id_cheque_serie_error").text("Falta el numero de serie"); 
             
                            }else{

                              $("#id_cheque_serie_error").text(""); 

                            } 


                            if($("#id_cheque_telefono").val() == ""){

                              vacio = false;
                              $("#id_cheque_telefono_error").text("Falta el numero de Telefono"); 

             
                            }else if(isNaN($("#id_cheque_telefono").val())) { // si tiene tecto

                              $("#id_cheque_telefono_error").text("El teléfono solo debe contener números");  
                                   
                            }else if($("#id_cheque_telefono").val().length < 9) { 

                              vacio = false;
                              $("#id_cheque_telefono_error").text("El teléfono debe contener 9 números");  
                                   
                            }else{

                              $("#id_cheque_telefono_error").text(""); 

                            }                          
                            


                            if($("#id_cheque_monto").val() == ""){

                              vacio = false;
                              $("#id_cheque_monto_error").text("Falta el monto"); 

                            }else{

                              $("#id_cheque_monto_error").text(""); 

                            } 


                            if($("#id_cheque_banco").val() == ""){
 
                              vacio = false;
                              $("#id_cheque_banco_error").text("Falta el Banco"); 

                            }else{

                              $("#id_cheque_banco_error").text(""); 

                            } 

                            if ( !Fn.validaRut( $("#id_cheque_rut_titular").val() )){

                              vacio = false;        
                              $("#id_cheque_rut_titular_error").text("Rut invalido");

                              return 
                            }else{

                              $("#id_cheque_rut_titular_error").text("");

                            }
                           
                 

                        break
                        }// fin pago CHEQUE

                    case 'EFECTIVO':
                        {
                 

                          break;
                        }


                    case 'EXCEDENTE':
                        {

                          var str = $("#monto_excedente").val();
                          var res = str.replace("$"," ");
                          vm.pago.monto  = parseInt(res);                 
                          break;
                        }



                }  // FIN--------------------switch para validar el tipo de pago con respectivos campos-------
                if(vacio == false){ // Levanto modal con mensajes agregados  si viene en true la variable
 
                  return false
                }
      
//Fin----VALIDACIONES----     
            if($("#for-pag").val() != 0){

              pagoRowAgregar = { tipo:$("#for-pag").val(), monto: vm.pago.monto}; //lleno de  valores
              vm.agregaRowMediosPago.push(pagoRowAgregar); //agrego objeto a listado de pago 

            }    



         incrementaRowAgregar++;


           //----------variables para validar-------




            vm.servicioLocal.atencion.totalExedenteComprobante[0] = 0;



           //FIN-------variables para montos-------
            angular.forEach(vm.agregaRowMediosPago, function (pago) { // recorro "vm.agregaRowMediosPago" para sumar los medios de pago 

                

                switch (pago.tipo) {
                    case 'EFECTIVO':
                        {
                            vm.cambioAdevolver = 0;
                            montoPagoEfectivo += pago.monto;   
                            medioPagoEfectivo = true; 
                            $("#id_efectivo_pago").hide();
                            $("#id_efectivo").hide();
                                  
                            break;
                        }

                    case 'CHEQUE':
                        {
                            montoPagoCheque += pago.monto;   
                            medioPagoCheque = true;
                            $("#id_cheque_pago").hide();
                            $("#id_cheque").hide();

                            break;
                        }

                    case 'EXCEDENTE':
                        {


 
                          if(vm.pago.medioPagoExcedente !== true){

                              if(vm.atencion.datosPago.totales.montoExcedentePendiente == vm.atencion.datosPago.totales.montoExcedenteInicial){ //If para que reste solo cuando debe a totales.montoExcedentePendiente
                                montoPagoExcedente += pago.monto;
                                vm.atencion.datosPago.totales.montoExcedentePendiente =parseInt(vm.atencion.datosPago.totales.montoExcedentePendiente) - parseInt(pago.monto);
                                
                                $("#id_excedente_pago").hide();
                                $("#id_excedente").hide();
                                medioPagoExcedente= true; 




                              }


                          }

                          

                      
                            break;
                        }

                }
                $("#form_pago input").val("");
                $("#for-pag").val(0);    

                montoTotalPagado = montoPagoEfectivo + montoPagoExcedente + montoPagoEfectivo; // Sumo los totales              
            
            });

            if(medioPagoExcedente == false){ // si elime en vm.removePago 

              montoPagoExcedente = 0;


            }



   
            vm.pago = { // lleno el array pago con los respectivos valores

                monto: vm.totalPendiente(),
                medioPagoCheque: medioPagoCheque,
                montoPagoCheque: montoPagoCheque,                  
                medioPagoExcedente: medioPagoExcedente,
                montoPagoExcedenteOK: montoPagoExcedente,

                montoPagoExcedente: montoPagoExcedente,                
                montoExcedentePendiente: montoExcedentePendiente,       

                medioPagoEfectivo: medioPagoEfectivo,
                montoPagoEfectivo: montoPagoEfectivo,

                numeroCheque: $("#id_cheque_numero").val(),
                numeroSerieCheque: $("#id_cheque_serie").val(),
                rutTitularCheque: $("#id_cheque_rut_titular").val(),
                telefonoTitularCheque: $("#id_cheque_telefono").val(),
                idBancoCheque: $("#id_cheque_banco").val(),   

 
            };

 
            angular.forEach(vm.servicioLocal.atencion.datosCopagoTotales,function(v,k){
 
              //if(vm.pago.medioPagoExcedente == true){         

  
 
            

                      if(vm.pago.montoPagoExcedente >= v){                
                  
                        vm.servicioLocal.atencion.totalExedenteComprobante[k] =  v ;
                        vm.pago.montoPagoExcedente = parseInt(vm.pago.montoPagoExcedente) - parseInt(v);


                                

                      }else{
    
                        vm.servicioLocal.atencion.totalExedenteComprobante[k] =  vm.pago.montoPagoExcedente;
                        vm.pago.montoPagoExcedente = 0;

                
                      }                    

              
   

               // vm.pago.medioPagoExcedente == false;

            

               
            });      


        };// FIN -------------- vm.agragarPago= function () 

        /**
         * Funcion que remueve el pago en la pantalla copago
         */

        vm.removePago = function (row) {

            var index = vm.agregaRowMediosPago.indexOf(row);
 
            if(row.tipo == "EFECTIVO"){
                //activo la lista desplegable "EFECTIVO" 
                //ya que el medio de pago en efectivo se avia ocultado 
                $("#id_efectivo_pago").show();
                $("#id_efectivo").show();
                $("#for-pag").val("EFECTIVO");    
                vm.cambioAdevolver = 0;

            }
            if(row.tipo == "EXCEDENTE"){

                medioPagoExcedente = false;

                $("#id_excedente_pago").show();
                $("#id_excedente").show();
                $("#for-pag").val("EXCEDENTE");                    
                vm.cambioAdevolver = 0;
                vm.atencion.datosPago.totales.montoExcedentePendiente +=row.monto;
                vm.servicioLocal.atencion.totalExedenteComprobante = [];
                vm.atencion.datosPago.totales.montoExcedenteUsar  = 0;


            }
            if(row.tipo == "CHEQUE"){
                $("#id_cheque_pago").show();
                $("#id_cheque").show();
                $("#for-pag").val("CHEQUE");                   
                vm.cambioAdevolver = 0;

            }

            if (index !== -1) {
                
                vm.agregaRowMediosPago.splice(index, 1); // quito del listado html 

            } 

        };
        /**
         * funcion que calcula lo pendiente por pagar en vista TOTAL PENDIENTE
         */

        vm.totalPendiente = function () {

       
 
            var total = 0;
            var total_maximo = 0;
            angular.forEach(vm.agregaRowMediosPago, function (pago) {
                total += pago.monto;
                total_maximo += pago.monto;                
            });
            if(vm.atencion.datosPago.totales.copago - total == 0){ //-----desactivo el pago cuendo es 0

                $("#for-pag").attr("disabled",true);

            }else{

                $("#for-pag").attr("disabled",false);

            }           //--------------------------------------------Fin desactivo el pago cuendo es 0

            return vm.atencion.datosPago.totales.copago - total;

        };

        vm.totalPendienteExcedente = function () {
            var total = 0;
            angular.forEach(vm.pagos, function (pago) {
                total += pago.excedente;
            });

            return vm.atencion.datosPago.totales.copago - total;

        };

        vm.confirmarPago = function () {

            vm.showPago = false;
            vm.showConfirmacion = true;
            vm.generaArrayInsertFinal();

            $state.go('ram.confirmacion');
            vm.atencion.datosUsuario = vm.datosSesion;
            vm.atencion.datosPago.tiposPago.push(vm.pago); 
            vm.atencion.datosAtencion.fecha = moment();
            vm.atencion.datosAtencion.fecha_unix = (new Date(moment()).getTime()/1000);            
            vm.atencion.datosAtencion.tipoAtencion = vm.tipoAtencion;
            if (vm.tipoAtencion === 'PARTICULAR') {
                vm.atencion.datosAtencion.estadoAtencion = 'CONFIRMADA';
            } else {
                vm.atencion.datosAtencion.estadoAtencion = 'PAGADA';
            }
            vm.servicioMilliways.insertarAtencion();
                 
        };
 
        /**
         * imprime la atencion
         */
        vm.print = function () {

          $timeout($window.print, 0);

        };
 
        vm.btnCancelarTransaccion = function () {

            vm.servicioLocal.limpiaDatosAtencion();
      

            vm.servicioLocal.datosPaciente = {};
            vm.servicioLocal.atencion.datosPaciente = {};
            vm.servicioLocal.atencion.datosBeneficiario = {}; 
            vm.atencion.datosPrestacionesComprobanteImprimir = [];
            vm.servicioLocal.atencion.totalExedenteComprobante = [];

            vm.atencion.datosPago.totales = {
                    total: 0,
                    montoEfectivo: null,
                    montoCheque: null,
                    montoExcedenteUsar: null,
                    montoExcedenteInicial: null,                    
                    montoCcaf: null,
                    montoTarjetaCredito: null,
                    montoTarjetaDebito: null,
                    montoIsapre: null,
                    montoSeguro: null,
                    copago: null,
                };
                                  
            vm.servicioLocal.datosDetalleCaja = [];
            vm.servicioMilliways.consultaDatosCierreCaja();
         
        };

        vm.btnParticular = function () {
          
            $("#btn_modo_online").hide();
            vm.tipoAtencion = 'PARTICULAR';
            vm.servicioLocal.limpiaDatosAtencionParticular();
            vm.atencion.datosAtencion.tipoAtencion = vm.tipoAtencion;
            vm.servicioLocal.datosPaciente.montoExcedente = false;

            $("#id_btn_valorizar_online").css("display","none");
            $("#id_btn_pagar_online").css("display","block").attr("disabled",true);
            $("#notificaciondiv").css("display","none");

            
        };

        vm.opcionPostConfirmaBono = function(value){

        
          $("#confirmar_envio_bono").attr("disabled",false);
 
           if(value == "Enviar"){

            $("#correo_bono").attr("disabled",false);
            $("#imprimeOEnviaBono").text("Enviar");
 
          }
 
          if(value == "Imprimir"){

            $("#correo_bono").attr("disabled",true);
            $("#imprimeOEnviaBono").text("Imprimir").attr("disabled",false);


          }

        }
 
        vm.imprimeOEnviaBono = function () {


          if($("#id_imprimir_bono").is(":checked")){
    
            $timeout($window.print, 0);
   
          }else{


              var exp_reg_mail = /[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
              var valor_campo = $("#correo_bono").val();

              if (valor_campo == ""){

                $("#id_correo_envio_error").text("Falta el Email");  


                return

              }else if(!exp_reg_mail.test(valor_campo))

              {  

                

                $("#id_correo_envio_error").text("Email invalido");  


                return


              }else{

                $("#id_correo_envio_error").text("");  

                $("#imprimeOEnviaBono").attr("disabled",true);

                $.post('bono_email/index.php',
                         {prestaciones:vm.atencion.datosPrestacionesComprobante[0],
                          totalMontoComprobante:vm.atencion.totalMontoComprobante,
                          datosBonificacionTotales:vm.atencion.datosBonificacionTotales,
                          datosCopagoTotales:vm.atencion.datosCopagoTotales,
                          datosBonificacionTotales:vm.atencion.datosBonificacionTotales,
                          totalExedenteComprobante:vm.servicioLocal.atencion.totalExedenteComprobante,
                          datosFolio:vm.atencion.datosFolio,

                          datosTitular:vm.atencion.datosTitular,
                          datosBeneficiario:vm.atencion.datosBeneficiario,
                          datosUsuario:vm.atencion.datosUsuario,

                          razonSocialRut:vm.atencion.datosUsuario.razonSocialRut,
                          tipoAtencion:vm.atencion.datosAtencion.tipoAtencion,
                          plan:vm.atencion.datosIsapre.plan,
                          fecha_atencion_unix:vm.atencion.datosAtencion.fecha_unix,
                          emailEnvio:$("#correo_bono").val(),

                        },function(response){ 

                        $("#imprimeOEnviaBono").text("Enviado");

                  });
              } 


            };
          }



        $timeout(function () {
       
            $('#cantidad').numeric();
            
            $scope.$watch(function () {
                return location.hash
            }, function (value) {

                  
                $("#id_boton_login").text("IDENTIFICAR OPERADOR");
                if(value == "#/ram"){


               
                    if(!vm.servicioLocal.datosPaciente.nombre){
                    
                       //$state.go('menu');

                    }

                    $("#BotonesA").removeClass("inactive-breadcrumbs");
                    $('#cantidad').numeric(); 
 
                    $("#gen_com").css("display","none");
                    $("#id_btn_pagar_online").css("display","block");
                    $('#re_connect').click();

    // vacion los arrays ya que sali de la session  "creo que esto esta de mas ta que esta en otro lado"                
                    vm.agregaRowMediosPago = [];
                    vm.pago = {
                        monto: null,
                        numeroCheque: null, 
                        numeroSerieCheque: null, 
                        rutTitular: null,
                        nombreTitular: null,
                        codigoBanco: null,
                        nombreBanco: null, 
                        tipoTarjeta: null, 
                        numeroTargeta: null, 
                        numeroPagare: null, 
                        telefonoTitular: null,


                    };
         
    // FIN vacion los arrays ya que sali de la session  "creo que esto esta de mas ta que esta en otro lado"            

 
                } // FIN----------if(value == "#/ram"){-----------------

               
                switch(value){

                  case '#/ram/pago':
                      {
                                               
 

                        if(vm.servicioLocal.datosPaciente.montoExcedente == 0){

                          $("#id_excedente").hide();
                          
                        }
              
                        $("#BotonesB").removeClass("inactive-breadcrumbs");
                        $("#BotonesA").addClass("inactive-breadcrumbs");
                        $("#gen_com").css("display","block");
                        $("#id_btn_pagar_online").css("display","none");
                        $('#monto_efectivo').numeric();  
                        $('#id_cheque_numero').numeric();  
                        $('#id_cheque_serie').numeric(); 
                        $('#id_cheque_monto').numeric();
                        $('#monto_excedente').numeric();
                        $('#re_connect').click();     

                
                      break
                      }

                  case '#/ram/confirmacion':
                      {
                
                        $("#gen_com").css("display","none");
                        $("#BotonesB").addClass("inactive-breadcrumbs");
                        $("#BotonesA").addClass("inactive-breadcrumbs");
                        $("#BotonesC").removeClass("inactive-breadcrumbs");
                        $('#re_connect').click();
                        $("#id_imprimir_bono").prop("checked", "checked");
                      break
                      }


                }
 
          
            });

            }

        );

        /**
         * llamada a funcion que inicializa el controlador
         */
        init();
    }
})();