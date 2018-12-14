(function () {

    'use strict';

    /**
     * @ngdoc function
     * @name medipassBE.controller:TocController
     * @description
     * # TocController
     * Controller of the medipassBE
     */
    angular.module('medipassBE')
        .controller('TocController_sin_toc', TocController_sin_toc);
    TocController_sin_toc.$inject = ['$http','$scope', '$timeout', '$sce', '$window', '$state', '$stateParams', 'verificadorConexion', 'servicioLocal','servicioMilliways','$localStorage'];

    function TocController_sin_toc($http,$scope, $timeout, $sce, $window, $state, $stateParams, verificadorConexion, servicioLocal,servicioMilliways,$localStorage) {

        var vm = this;
        vm.$state = $state;
        vm.$stateParams = $stateParams;
        vm.verificadorConexion = verificadorConexion;
        vm.datosSesion = servicioLocal.getDatosSesion();
        vm.datosPaciente = servicioLocal.getDatosPaciente();
        vm.datosMensaje = servicioLocal.datosMensaje; 
        vm.servicioMilliways = servicioMilliways;
        vm.servicioLocal  = servicioLocal;
  
        $scope.$watch('vm.verificadorConexion.isOnline()', function (online) {
            
            vm.onlineStatusString = online ? 'ONLINE' : 'OFFLINE';
     
        });

        vm.confirmarToc = function (stateName) {
 
 
            switch (stateName) {
                case 'tocusuario':
  
                    var rut = $("#id_rut_apertura_caja").html();
                    vm.servicioMilliways.validarUsuario(rut);
                                   
                    break;

                case 'tocpaciente':

                    var rut = $("#campo_texto_rut-paciente").val();
                    vm.servicioMilliways.buscarEntidadesRutBeneficiario(rut);                               
     
                    break;

                case 'simulacion':

                    vm.$stateParams.nombreOpcion = "ramsimulacion";

                    var rut = $("#campo_texto_rut-paciente").val();
                    vm.servicioMilliways.buscarEntidadesRutBeneficiario(rut);                               
     
                    break;


            }

        };

        $timeout(function () {
 
            if(!vm.datosSesion){

               $state.go('menu');

            }


            $scope.$watch(function () {
                return location.hash
            }, function (value) {

 
                if(value == "#/identificacion-usuario-sin-toc"){

                    vm.servicioMilliways.validarUsuario("25606650-5"); 
            
                }


          
            });

            $scope.$watch(
            function () {
                return $window.rutBene;
            }, function (n, o) {

                console.log("changed rutBene ", n);
            }
            );

            }

        );
    }

})();
