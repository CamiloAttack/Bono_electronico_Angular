(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name medipassBE.directive:bono_no_valido
     * @description
     * # bono-no-valido
     */
    angular.module('medipassBE')
  .directive('bononovalido', bononovalido);

    function bononovalido() {
        var directive = {
          restrict: 'E',
          replace: true,
          scope:{
          },
          templateUrl: 'views/components/bono-no-valido.html',
          link: linkFunc,
          controller: bono_no_validoController,
          controllerAs: 'vm',

      };
        return directive;

        function linkFunc(scope, attr, Controller) {
            console.log(attr);
        }
    }

    bono_no_validoController.$inject = ['servicioLocal'];

    function bono_no_validoController(servicioLocal) {
        var vm = this;
        vm.atencion = servicioLocal.atencion;
        console.log('vm.atencion');        
        console.log(vm.atencion);
    };

})();
