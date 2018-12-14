(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name medipassBE.servicioLocal
     * @description
     * # servicioLocal
     * Service in the medipassBE.
     */
    angular.module('medipassBE')
        .filter('unique', unique);

    function unique() {
        return function(collection, keyname) {
            var output = [],
                keys = [];

            angular.forEach(collection, function(item) {
          var key = item[keyname];
          if (keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

            return output;
        };
    }

})();
