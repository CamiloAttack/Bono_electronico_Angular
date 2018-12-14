(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name medipassBE.verificadorConexion
     * @description
     * # verificadorConexion
     * retorna true si hay conexion y false en caso contrario
     * Factory in the medipassBE.
     */
    angular.module('medipassBE')
        .factory('verificadorConexion', verificadorConexion);

    verificadorConexion.$inject = ['$window', '$rootScope','servicioLocal'];

    function verificadorConexion($window, $rootScope,servicioLocal) {

        var vm = this;

        vm.datosMensaje = servicioLocal.datosMensaje; 

        var onLine = $window.navigator.onLine;
        $window.addEventListener('online', online, true);
        $window.addEventListener('offline', offline, true);


        function conexion_millyways(){

        }

        if(onLine){

            conexion_millyways()

        }

        function online() {
        
            onLine = true;
            $rootScope.$digest();
            conexion_millyways();


        }

        function offline() { 

            $("#contenido_mensaje").html(vm.datosMensaje.no_mw); 
            $("#modal_mensajes").modal('show');    
            
            onLine = false;
            $rootScope.$digest();
        }

        function isOnline() {

            return onLine;
        }

        return {

            isOnline: isOnline,
        };

    }
})();
