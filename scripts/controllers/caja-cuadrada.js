(function () {
'use strict';

/**
 * @ngdoc function
 * @name medipassBE.controller:CajaController
 * @description
 * # CajaController
 * Controller of the medipassBE
 */
angular.module('medipassBE')
  .controller('CajaCuadradaController', CajaCuadradaController);
CajaCuadradaController.$inject = ['$state', 'servicioLocal','$localStorage','servicioMilliways','$resource'];
function CajaCuadradaController($state, servicioLocal,$localStorage,servicioMilliways,$resource) {
    var vm = this;
    vm.$state = $state;
    vm.servicioLocal = servicioLocal;
    vm.datosSesion = servicioLocal.getDatosSesion();
    vm.servicioMilliways = servicioMilliways;
 
 
    var fecha_hora=vm.datosSesion.fechaHoraServidor;
    var resultadoFecha=fecha_hora.substring(0,10);
    var resultadoHora=fecha_hora.substring(11,19);
 
    vm.fechaAperturaCaja = resultadoFecha +" | "+ resultadoHora;
    $("#monto").numeric(); 
    $("#monto").css("color","#fff");
   
    vm.inputVacioClick = function(){ 
 

        if($("#monto").val() == "0.00"){
            
            $("#monto").css("color","#fff");

           $("#monto").val("");     

        }

    }

    vm.inputVacioChange = function(){ 

        if($("#monto").val() != "0.00"){

            if($("#monto").val() != ""){

                $("#monto").css("color","#777");

            }    

        } 
     
  
    }

    vm.abrirCaja = function () {
        vm.servicioMilliways.consultaAtencion();
        vm.datosSesion.montoApertura =  vm.montoApertura;
        vm.datosSesion.fechaAperturaCaja = vm.fechaAperturaCaja;
    
        var montoAperturaCaja = $("#monto").val();
        montoAperturaCaja = montoAperturaCaja.replace("$","");
        montoAperturaCaja = montoAperturaCaja.replace(".",""); 
        montoAperturaCaja = montoAperturaCaja.replace(".",""); 
        montoAperturaCaja = montoAperturaCaja.replace(".","");              
        montoAperturaCaja = montoAperturaCaja.replace(".",""); 

        vm.servicioLocal.datosSesion.idUsuario; 
          
        $resource('http://'+vm.servicioLocal.subDominio.valor+'.openpartner.cl/sistema_financiador/isapre/sp?tipo_tx=1&monto_ap_ci='+montoAperturaCaja+'&id_usuario='+vm.servicioLocal.datosSesion.idUsuario+'&fecha_ap_ci='+vm.servicioLocal.datosSesion.fechaServidor+'&detalle=promise&id_session&accion=session_caja').query().$promise.then(function(response) {
          
            vm.servicioLocal.idSesionCaja = response[0].idSesionCaja;
        });

        $localStorage.$default({
            monto : vm.montoApertura,
            fechaAperturaCaja:vm.fechaAperturaCaja
        });

        vm.$state.go('menu');

    };

}
})();
