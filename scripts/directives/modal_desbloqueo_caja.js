(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name medipassBE.directive:bono
     * @description
     * # bono
     */
    angular.module('medipassBE')
  .directive('desbloqueocaja', desbloqueocaja);

 function desbloqueocaja() {
        var directive = {
          restrict: 'E',
          replace: true,
          scope:{
          },
          templateUrl: 'views/components/modal_desbloqueo_caja.html',
          link: linkFunc,
          controller: desbloqueocajaController,
          controllerAs: 'vm',

      };
        return directive;

        function linkFunc(scope, attr, Controller) {
            console.log(attr);
        }
    }

    desbloqueocajaController.$inject = ['servicioLocal'];

    function desbloqueocajaController(servicioLocal) {
        var vm = this;
        vm.datosSesion = servicioLocal.datosSesion;

          vm.desbloquearCaja= function(){

        
       
            if($("#id_rut_desbloquear").val() == vm.datosSesion.rutCajero ){

                $("#Modal-boquear-caja").modal('hide');
                $("#id_mensaje_operador").text("COLOQUE EL RUT DEL OPERADOR SOBRE EL TOC");                

            }else{

                $("#id_mensaje_operador").text("RUT OPERADOR NO CORRESPONDE A LA SESION");

            }

          }
    };

})();
