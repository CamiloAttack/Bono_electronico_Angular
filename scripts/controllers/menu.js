(function () {

'use strict';

/**
 * @ngdoc function
 * @name medipassBE.controller:MenuController
 * @description
 * # MenuController
 * Controller of the medipassBE
 */
angular.module('medipassBE')
  .controller('MenuController', MenuController);
    MenuController.$inject = ['servicioLocal','$state','servicioMilliways'];

function MenuController(servicioLocal,$state,servicioMilliways) {

    var vm = this;

    vm.servicioMilliways = servicioMilliways;

    vm.cancelarRegitroAtencion = servicioLocal.cancelarRegitroAtencion;

   // 
 
 	vm.servicioMilliways.consultaAtencion();	
 
    if(servicioLocal.cancelarRegitroAtencion.valor == true){
 
		vm.cancelarRegitroAtencion  == false;
	 
	}
	 
	$("#re_connect").click();
  if(history.forward(1)){

     history.replace(history.forward(1));
     
  }
    

}
})();
