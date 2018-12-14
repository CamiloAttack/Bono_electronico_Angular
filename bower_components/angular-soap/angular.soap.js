angular.module('angularSoap', [])

.factory("$soap",['$q',function($q){
	return {
		post: function(url, action, params, headers){
			var deferred = $q.defer();
			//Create SOAPClientParameters
			var soapParams = new SOAPClientParameters();

			if(params){
				for(var param in params){
					soapParams.add("urn:"+param, params[param]);
				}
			}


			//Create Callback
			var  GetSoap_callBack = function(e){
			    if(e == null || e.constructor.toString().indexOf("function Error()") != -1){
			        deferred.reject("An error has occurred.");
			    } else {
			        deferred.resolve(e);
		
			    }
			}
			 

			//console.log(soapParams);
			//SOAPClient.invoke(url, action, soapParams,true,GetSoap_callBack);	
			SOAPClient.invoke(url, action, soapParams, true,GetSoap_callBack);
			return deferred.promise;
		},
		setCredentials: function(username, password){
			SOAPClient.username = username;
			SOAPClient.password = password;
		}
	}
}]);
