(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name medipassBE.directive:bono
     * @description
     * # bono
     */
    angular.module('medipassBE')
  .directive('bonoimprimir',bonoimprimir);

    function bonoimprimir() {
        var directive = {
          restrict: 'E',
          replace: true,
          scope:{
          },
          templateUrl: 'views/components/bono-imprimir.html',
          link: linkFunc,
          controller: bonoimprimirController,
          controllerAs: 'vm',

      };
        return directive;

        function linkFunc($scope, attr, Controller) {
        
        }
    }

    bonoimprimirController.$inject = ['servicioLocal','$stateParams','$scope'];

    function bonoimprimirController(servicioLocal,$stateParams,$scope) {
            $scope.$watch(function () {
                return location.hash
            }, function (value) {

           
		     	if(value == "#/ram/confirmacion"){

		    		$(".copia").text("");
		    		$(".copia_imprimir").text("");

		    	}
		    	if(value == "#/ramsimulacion/confirmacion"){

		    		$(".copia").text("NO VALIDO");
		    		$(".copia_imprimir").text("NO VALIDO");

		    	}

            });

        var vm = this;
        vm.atencion = servicioLocal.atencion;
 
    };

})();
