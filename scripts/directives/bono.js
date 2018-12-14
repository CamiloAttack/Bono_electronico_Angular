(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name medipassBE.directive:bono
     * @description
     * # bono
     */
    angular.module('medipassBE')
  .directive('bono', bono);

    function bono() {
        var directive = {
          restrict: 'E',
          replace: true,
          scope:{
          },
          templateUrl: 'views/components/bono.html',
          link: linkFunc,
          controller: bonoController,
          controllerAs: 'vm',

      };
        return directive;

        function linkFunc(scope, attr, Controller) {
            console.log(attr);
        }
    }

    bonoController.$inject = ['servicioLocal'];

    function bonoController(servicioLocal) {
        var vm = this;
        vm.atencion = servicioLocal.atencion;

        console.log('servicioLocal.atencion');        
        console.log(vm.atencion);
    };

})();
