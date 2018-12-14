var TOC = (function() {
    var self  = {},
    toc    	  = null, // Hub reference
    callbacks = null, // Callbacks a ejecutar
    executeFunctionByName = function(functionName, context /*, args */ ) {
      var tslice   = [].slice, 
          targs    = tslice.call( arguments ),      // arguments son los argumentos entregados a esta funcion
          args     = targs.splice(2,targs.length);  // Arreglo con los argumentos a procesar, a partir del index 2
      var namespaces = functionName.split(".");
      var func = namespaces.pop();                  // Nombre de la funcion que se espera ejecutar
      for(var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];           // Se registran las funciones al context (ej: windows)
      }
      return context[func].apply(this, args);       // Se ejecuta la funcion con los respectivos argumentos
    },
    makeOn = function(key) {
      return function(data) {
        executeFunctionByName( callbacks[key] , window, data); 
      };
    };
    self.exec = function(_action, _callbacksList){
  		jqTOC.connection.hub.url  = 'https://localhost:12321/signalr';
      jqTOC.connection.hub.qs   = { 'acto': _action };

  		toc = jqTOC.connection.myHub;
  		callbacks = _callbacksList;
      jqTOC.connection.hub.start().done(function () {
      }); // Se inicia la conexion con el hub

      for (var key in callbacks) {
      	if (callbacks.hasOwnProperty(key)) {
      		toc.client[key] = makeOn(key); // Se registra callback
      	}
      }
    };
    self.emit = function(_type, _data){
      var response = typeof _data !== 'undefined' ? toc.server[_type](_data) : toc.server[_type]();
    };
    self.disconnect = function(){
      jqTOC.connection.hub.stop();
    };
    return self;
}());