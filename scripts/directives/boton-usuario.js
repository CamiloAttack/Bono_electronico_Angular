(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name medipassBE.directive:botonUsuario
     * @description
     * # botonUsuario
     */
    angular.module('medipassBE')
  .directive('botonUsuario', botonUsuario);

    function botonUsuario() {
        var directive = {
          restrict: 'E',
          replace: true,
          templateUrl: 'views/components/boton-usuario.html',
          link: linkFunc,
          controller: BotonUsuarioController,
          controllerAs: 'vm',
          scope: {
            eventHandler: '&ngClick'
          },

      };
        return directive;

        function linkFunc(scope,attr, Controller, state,servicioMilliways) {

        }
    }

    

    BotonUsuarioController.$inject = ['servicioLocal', '$state','$scope','$localStorage','$uibModal','servicioMilliways'];

    function BotonUsuarioController(servicioLocal, $state,$scope,$localStorage,$uibModal,servicioMilliways) {
      var vm = this;         
      vm.datosSesion = servicioLocal.getDatosSesion();
      
      console.log('vm.servicioMilliways');      
      console.log(servicioMilliways.validarSupervisor("13942219-8"));


 
      $scope.cerraSesion = function ($state) {

          localStorage.clear();//limpio localstorage
          servicioLocal.limpiarDatosSesion();
          vm.datosSesion = {};  
          location.href =location.pathname;

       };

       $scope.modalBloquearCaja = function(){

            var modalInstance = $uibModal.open({

              animation: true,
              scope: $scope,
              backdrop:'static',

              templateUrl: 'views/components/modal_desbloqueo_caja.html',
              controller: function ($scope, $uibModalInstance,servicioMilliways) {

                var vm = this;

               $scope.ok = function () {

                       $uibModalInstance.close();

                  };

                  $scope.cancel = function () {

                      $uibModalInstance.dismiss('cancel');

                  };

                  $scope.desbloquearCaja = function(){   
             
                    servicioMilliways.validarSupervisor($("#campo_texto_rut_supervisor").val());
                    
                  };


              }
              
            });


        };




      }

})();
