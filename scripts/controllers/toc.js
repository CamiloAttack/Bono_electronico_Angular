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
     .controller('TocController', TocController);
     TocController.$inject = ['$http','$scope', '$timeout', '$sce', '$window', '$state', '$stateParams', 'verificadorConexion', 'servicioLocal','servicioMilliways','$localStorage'];

     function TocController($http,$scope, $timeout, $sce, $window, $state, $stateParams, verificadorConexion, servicioLocal,servicioMilliways,$localStorage) {

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
        vm.servicioMilliways.consultaMensaje();


        vm.confirmarToc = function (stateName) {


            switch (stateName) {
                case 'tocusuario':

                var rut = $("#campo_texto_rut-paciente").val();
                vm.servicioMilliways.validarUsuario(rut);

                break;
                case 'tocpaciente':
                var rut = $("#campo_texto_rut-paciente").val();
                vm.servicioMilliways.buscarEntidadesRutBeneficiario(rut); 

                break;

                case 'simulacion':

                var rut = $("#campo_texto_rut-paciente").val();
                vm.servicioMilliways.buscarEntidadesRutBeneficiario(rut); 


                break;


            }

        };

        $timeout(function () {

            if(history.forward(1)){
                history.replace(history.forward(1));
            }
            
            console.log('DOM ready');
            console.log($window.rutBene);

            $scope.$watch(function () {
                return location.hash 
            }, function (value) {

                var operadorOpaciente;

                switch (value) { 
                    case '#/identificacion-usuario':
                    {
                        $("#sinAcentos").show();
                        operadorOpaciente = "OPERADOR ";
                        $("#campo_texto_rut-paciente").val("13942219-8");
                        $('#re_connect').click();


                    }
                        break
                    case '#/identificacion-simulacion':
                    {

                        operadorOpaciente = "PACIENTE";
                        $("#campo_texto_rut-paciente").val("10179892-5");                         
                        $('#re_connect').click();     

                        break
                    }
                    case '#/menu':
                    {

                        operadorOpaciente = "SUPERVISOR ";
                        $("#id_boton_login").text("IDENTIFICAR SUPERVISOR");
                      
                      
                        break
                    }

    
                    case '#/identificacion-paciente/simulacion':
                    {
                  
                        operadorOpaciente = "PACIENTE ";
                        $("#id_boton_login").show();
                        $("#sin_acentos").hide();                            
                        $("#app").hide();
                        $("#id_boton_login").attr("disabled",false);
                        $("#id_botones_login").removeClass("abajo").addClass("identifica-paciente");

                        break
                    }


                    case '#/identificacion-paciente/ram':
                    {

                        $("#sinAcentos").hide();
                        $("#campo_texto_rut-paciente").val("23849406-0").show();      
                        operadorOpaciente = "PACIENTE ";
                        $("#id_boton_login").show();    
                        $('#re_connect').click();

                        break
                    }


       
                }        

                $("#accionEnToc").text("COLOQUE EL RUT DEL " + operadorOpaciente);
                $("#id_boton_login").text("IDENTIFICAR " + operadorOpaciente);


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
