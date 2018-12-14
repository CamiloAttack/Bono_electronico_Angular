(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name medipassBE.controller:RamsimulacionController
     * @description
     * # RamsimulacionController
     * Controller of the medipassBE
     */
    angular.module('medipassBE')
        .controller('RamsimulacionController', RamsimulacionController);
    RamsimulacionController.$inject = ['$http','$scope', '$state', '$stateParams', 'verificadorConexion', 'servicioLocal', '$window', '$timeout','servicioMilliways','$localStorage','$sessionStorage','_'];

    function RamsimulacionController($http,$scope, $state, $stateParams, verificadorConexion, servicioLocal, $window, $timeout,servicioMilliways,$localStorage,$sessionStorage,ngMessages,_) {
        var vm = this;
        vm.disabled = undefined;
        vm.convenio = '';
        vm.state = $state.current.name; 
   
        $scope.rut = '';

        vm.stateParams = $stateParams;
        vm.verificadorConexion = verificadorConexion;
        vm.atencion = servicioLocal.atencion;
        vm.datosPaciente = servicioLocal.datosPaciente;
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

                       console.log('v');       console.log(v);
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

        vm.selectDependienteMedicoEspecialidad = function(){



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

// -------------------Incremento si agrego la misma prestacion mas de una vez---------------------------

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
                nombre_isapre:vm.datosPaciente.isapre,
    
            };






/*
----------------------------------------------------
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
        vm.servicioLocal.nombreAcompanante = vm.datosPaciente.nombreAcompanante;
        vm.servicioLocal.numeroConvenio = vm.form.prestacion.selected.numeroConvenio;
  
        //Fin variables para enviarBono


 


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
                              "urn:bonificacion":1,
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
                                   "urn:monto":0, // monto
                                    "urn:montoBonificacion":0, // bonificacion 
                                   "urn:bonificacion":0,
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



         console.log('----------------vm.datosPaciente-------------');
         console.log(vm.datosPaciente);
 
            vm.formularioPrestacion.$setPristine();

            vm.atencion.datosPrestaciones.push(vm.prestacion);// prestaciones en vista de atencion (dode se elijen las prestaciones)

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

                $("#id_btn_valorizar_online").css("display","block").removeAttr("disabled");
 
                $("#id_btn_pagar_online").css("display","none").removeAttr("disabled");                

            }else{
                $("#id_btn_valorizar_online").css("display","none");
                
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
  
        };
 
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
              
                    if (vm.datosPaciente.bonificaion == false ) {

                        vm.atencion.datosAtencion.tipoAtencion = 'PARTICULAR';

                        vm.atencion.datosBeneficiario.nombre = vm.datosPaciente.nombre;

                        vm.atencion.datosBeneficiario.apellidoPaterno = vm.datosPaciente.apellidoPaterno;

                        vm.atencion.datosBeneficiario.apellidoMaterno = vm.datosPaciente.apellidoMaterno;

                        vm.atencion.datosBeneficiario.rut = vm.datosPaciente.rut;

                        vm.atencion.datosTitular.nombre = vm.datosPaciente.nombrenombreCotizante

                        vm.atencion.datosTitular.rut = vm.datosPaciente.rutCotizante;                        


                    }else{

                        vm.atencion.datosAtencion.tipoAtencion = 'ONLINE';

                        vm.atencion.datosBeneficiario.nombre = vm.datosPaciente.nombre;

                        vm.atencion.datosBeneficiario.apellidoPaterno = vm.datosPaciente.apellidoPaterno;

                        vm.atencion.datosBeneficiario.apellidoMaterno = vm.datosPaciente.apellidoMaterno;

                        vm.atencion.datosBeneficiario.rut = vm.datosPaciente.rut;

                        vm.atencion.datosTitular.nombre = vm.datosPaciente.nombreCotizante;

                        vm.atencion.datosTitular.rut = vm.datosPaciente.rutCotizante;   

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
   
        vm.btnParticular = function () {
   
            $("#btn_modo_online").hide();
            vm.tipoAtencion = 'PARTICULAR';
            vm.servicioLocal.limpiaDatosAtencionParticular();
            vm.atencion.datosAtencion.tipoAtencion = vm.tipoAtencion;
            vm.datosPaciente.montoExcedente = false;
            $("#id_btn_valorizar_online").css("display","none");
            $("#id_btn_pagar_online").css("display","block").attr("disabled",true);
            $("#notificaciondiv").css("display","none");


        };

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

            vm.atencion.datosFolio = [];

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
                    vm.atencion.datosFolio[kk] = "Simulacion";
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

            console.log(vm.atencion.datosPrestacionesComprobanteImprimir);
        
        };



 
 
        vm.pagar = function () {

            vm.divideArrayComprobante(); // Ejecuto funcion 
            vm.atencion.datosAtencion.estadoAtencion = 'POR PAGAR';
            vm.showPago = true;
            vm.showConfirmacion = false;
     

            vm.pago = {
                monto: vm.atencion.datosPago.totales.copago,
            };

            vm.agragarPago();
            vm.confirmarPago();
            $("#id_btn_pagar_online").css("display","none");
            $state.go('ramsimulacion.confirmacion');
 
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

      //  vm.datosPaciente.montoExcedenteAusar = vm.atencion.datosPago.totales.copago; 
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
                                                "urn:montoExcedente":vm.pago.montoPagoExcedente,
                                                "urn:montoCCAF":"0",
                                                "urn:montoTarjetaCredito":"0",
                                                "urn:montoTarDebito":"0",
                                                "urn:montoISAPRES":vm.atencion.datosBonificacionTotales[k],
                                               // "urn:montoISAPRES":"0",
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

        }


         /**
         * Funcion que agrega el pago en la pantalla pago
         */
        vm.agregaRowMediosPago =[];  // array para  agregar valores de medios de pago a mostrar en pantalla (Medios de pago  y monto)
        var pagoRowAgregar ={};  // objeto que se agrega en  vm.agregaRowMediosPago   con  medios de pago y monto 
 
        vm.agragarPago= function () {
       //      console.log("----------------------------------------------vm.agragarPago----------------------------------------------");               
         
            vm.pago.monto = 32322;

            pagoRowAgregar = { tipo:"EFECTIVO", monto: vm.pago.monto}; //lleno de  valores 
            vm.agregaRowMediosPago.push(pagoRowAgregar); //agrego objeto a listado de pago 

           //----------variables para validar-------
            var medioPagoCheque = false; 
            var medioPagoExcedente = false;
            var medioPagoEfectivo = false; // abajo lo valido ya que el medio de pago en efectivo solo es una vez         
            //-FIN--------variables para validar-------

           //----------variables para de montos-------
            var montoPagoEfectivo = 0;
            var montoPagoCheque = 0;
            var montoPagoExcedente = 0;
            var montoExcedenteAusar = 0;
          

            var montoTotalPagado = 0;           
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



                }
                $("#form_pago input").val("");
                $("#for-pag").val(0);    

                montoTotalPagado = montoPagoEfectivo + montoPagoExcedente + montoPagoEfectivo; // Sumo los totales
              
              // -----------------------------------------FIn ----vm.agragarPago----------------------------------------------    
            });
   
            vm.pago = { // lleno el array pago con los respectivos valores

                monto: 0,
                medioPagoCheque: medioPagoCheque,
                montoPagoCheque: montoPagoCheque,                  
                medioPagoExcedente: medioPagoExcedente,
                montoPagoExcedente: montoPagoExcedente,
                montoExcedenteAusar: montoExcedenteAusar,                              
                medioPagoEfectivo: medioPagoEfectivo,
                montoPagoEfectivo: montoPagoEfectivo,


                numeroCheque: $("#id_cheque_numero").val(),
                numeroSerieCheque: $("#id_cheque_serie").val(),
                rutTitularCheque: $("#id_cheque_rut_titular").val(),
                telefonoTitularCheque: $("#id_cheque_telefono").val(),
                idBancoCheque: $("#id_cheque_banco").val(),   
    
            };

            angular.forEach(vm.servicioLocal.atencion.datosCopagoTotales,function(v,k){



                if(vm.pago.montoPagoExcedente >= v){

                     vm.servicioLocal.atencion.totalExedenteComprobante[k] =  v ;
          
                     vm.pago.montoPagoExcedente = parseInt(vm.pago.montoPagoExcedente) - parseInt(v);

                }else{

                    vm.servicioLocal.atencion.totalExedenteComprobante[k] =  vm.pago.montoPagoExcedente;
                    vm.pago.montoPagoExcedente = 0;
                }

               

            });
            console.log(vm.pago.montoPagoExcedente);
            console.log(vm.servicioLocal.atencion.totalExedenteComprobante);
                   console.log(vm.servicioLocal.atencion.datosCopagoTotales);
       


        };// FIN -------------- vm.agragarPago= function () 

        /**
 
        /**
         * funcion que calcula lo pendiente por pagar en vista TOTAL PENDIENTE
         */

        vm.totalPendiente = function () {
 
            var total = 0;
 
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
                 
        };
 
        /**
         * imprime la atencion
         */
        vm.print = function () {

            $timeout($window.print, 0);
        };
 
        vm.btnCancelarTransaccion = function () {

            vm.servicioLocal.limpiaDatosAtencion();

            vm.datosPaciente = {};
            vm.servicioLocal.atencion.datosPaciente = {}
            vm.servicioLocal.atencion.datosBeneficiario = {};
          
       
        };
 

        $timeout(function () {

                     
       
            $('#cantidad').numeric();
            
            $scope.$watch(function () {
                return location.hash
            }, function (value) {

                if(value == "#/ramsimulacion"){
          
                    if(!vm.datosPaciente.nombre){
                    
                       $state.go('menu');

                    }

                    $("#BotonesA").removeClass("inactive-breadcrumbs");
                    $('#cantidad').numeric(); 
 
                    $("#gen_com").css("display","none");
                    $("#id_btn_valorizar_online").css("display","block");
                    $("#id_btn_valorizar_online").attr("disabled","");
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
 

                  case '#/ramsimulacion/confirmacion':
                      {
                
                        $("#gen_com").css("display","none");
                        $("#BotonesB").addClass("inactive-breadcrumbs");
                        $("#BotonesA").addClass("inactive-breadcrumbs");
                        $("#BotonesC").removeClass("inactive-breadcrumbs");
                        $('#re_connect').click();     

                
                      break
                      }


                  case '#/ramsimulacion':
                      {
       
                        $('#re_connect').click();
                          
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
