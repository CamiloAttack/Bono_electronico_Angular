(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name medipassBE.directive:botonUsuario
     * @description
     * # botonUsuario
     */
    angular.module('medipassBE')
  .directive('botonUsuarioSimulacion', botonUsuarioSimulacion);

    function botonUsuarioSimulacion() {
        var directive = {
          restrict: 'E',
          replace: true,
          templateUrl: 'views/components/boton-usuario-simulacion.html',
          link: linkFunc,
          controller: botonUsuarioSimulacionController,
          controllerAs: 'vm',
          scope: {
            eventHandler: '&ngClick'
          },

      };
        return directive;

        function linkFunc(scope,attr, Controller, state) {

        }
    }

    

    botonUsuarioSimulacionController.$inject = ['servicioLocal', '$state','$scope','$localStorage'];

    function botonUsuarioSimulacionController(servicioLocal, $state,$scope,$localStorage) {
          var vm = this;         
          vm.datosSesion = servicioLocal.getDatosSesion();
 
       
          $scope.cerraSesion = function ($state) {

              localStorage.clear();//limpio localstorage
              servicioLocal.limpiarDatosSesion();
              vm.datosSesion = {};
      
              location.href =location.pathname;
              //vm.$state.go('tocusuario');
           };
 



      }

})();
