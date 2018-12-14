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
    TocController.$inject = ['$scope', '$timeout', '$sce', '$window', '$state', '$stateParams', 'verificadorConexion', 'servicioLocal'];

    function TocController($scope, $timeout, $sce, $window, $state, $stateParams, verificadorConexion, servicioLocal) {
        var vm = this;
        vm.$state = $state;
        vm.$stateParams = $stateParams;
        vm.verificadorConexion = verificadorConexion;
        vm.datosSesion = servicioLocal.getDatosSesion();
        vm.datosPaciente = servicioLocal.getDatosPaciente();

        var datosSesion = {
            usuarioNombreCompleto: 'Naomi Camp',
            usaurioRut: '25111222-3',
            usaurioEquipo: '1600 Amphitheatre',

        };

        $scope.$watch('vm.verificadorConexion.isOnline()', function (online) {
            vm.onlineStatusString = online ? 'ONLINE' : 'OFFLINE';

        });

        var datosPaciente = {
            nombre: 'Pepe',
            apellidoPaterno: 'Perez',
            apellidoMaterno: 'Perez',
            rut: '12345678-9',

        };

        vm.confirmarToc = function (stateName) {

            switch (stateName) {
                case 'tocusuario':
                    console.log('entro como usuario');
                    servicioLocal.pushDatosSesion(datosSesion);

                    // console.table(vm.servicioLocal.datosSesion);
                    //aqui debe llamarse el servicio que autentica el usuario contra el toc
                    //aqui de llamarse el servicio que carga la base de datos inicial
           
                    vm.$state.go('aperturaCaja');

                    break;
                case 'tocpaciente':
                    console.log(vm.$stateParams.nombreOpcion);
                    servicioLocal.pushDatosPaciente(datosPaciente);
                    console.log('entro un paciente');

                    //aqui debe llamarse el servicio que busca el paciente en las isapres
                    vm.$state.go(vm.$stateParams.nombreOpcion);
                    break;

            }

        };

        // vm.confirmarDiscapacitado = function() {
        //
        //     //pantalla de login y pass del paciente con atencion especial
        //     alert('EN DESARROLLO');
        // };
        //

        //funcion que hace el equivalente del document ready de jquery

        var ngCedulaLeida = function () {
            // Metodo que se invoca al momento de leer una cedula de identidad
            if (document.getElementById('myApplet').isNewID()) {
                //alert("cedulaLeida");

                vm.prew = document.getElementById('myApplet').getNombresNewCI() + ' ' + document.getElementById('myApplet').getApellidosNewCI() + ', R.U.T: ' + document.getElementById('myApplet').getRunNewCI();
                vm.colo = 'COLOCA EL DEDO INDICE DEL PACIENTE SOBRE EL TOC';

                //  rutBene = document.getElementById('myApplet').getRunNewCI();
                //  apeBene = document.getElementById('myApplet').getApellidosNewCI();
                //    nombreBene = document.getElementById('myApplet').getNombresNewCI();
            } else {
                vm.prew = document.getElementById('myApplet').getApellidoPaterno() + ', R.U.T: ' + document.getElementById('myApplet').getRut();
                vm.colo = 'COLOCA EL DEDO PULGAR DEL PACEINTE SOBRE EL TOC';

                //rutBene = document.getElementById('myApplet').getRut();
                //  apeBene = document.getElementById('myApplet').getApellidoPaterno();
            }

            document.getElementById('myApplet').style.height = '140px';
            document.getElementById('myApplet').style.border = '1px  #999999 solid';

        };

        $timeout(function () {
                console.log('DOM ready');
                console.log($window.rutBene);

                //No need to re-declare 'angular' in the arguments list
                var el = document.getElementById('myApplet');
                var test = angular.element(el).scope();
                console.log(test);

                //scope.reloadAndChooseView();
                $scope.$watch(
            function () {
                return $window.rutBene;
            }, function (n, o) {
                //ngErrorIniciarTOC();
                console.log("changed rutBene ", n);
            }
            );

            }

        );
    }

})();
