(function () {
'use strict';

/**
 * @ngdoc function
 * @name medipassBE.controller:CierreController
 * @description
 * # CierreController
 * Controller of the medipassBE
 */
/*angular.module('medipassBE')
  .controller('CierreController', function () {
      this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma',
      ];
  });*/


 angular.module('medipassBE').controller('CierreCajaController', CierreCajaController);
 
     CierreCajaController.$inject = ['$state', 'servicioLocal','$localStorage','servicioMilliways','$resource','$timeout'];

    function CierreCajaController($state, servicioLocal,$localStorage,servicioMilliways,$resource,$timeout) {

    	var vm = this; 
 
    	vm.servicioLocal = servicioLocal;
      	vm.servicioMilliways = servicioMilliways;
      	vm.servicioMilliways.consultaDatosCierreCaja();
 
    	vm.cuadrarCaja = function(){

	
		    $resource('http://'+vm.servicioLocal.subDominio.valor+'.openpartner.cl/sistema_financiador/isapre/sp?tipo_tx=1&monto_ap_ci='+$("#total_monto_recaudado_footer").text()+'&id_usuario='+vm.servicioLocal.datosSesion.idUsuario+'&fecha_ap_ci='+vm.servicioLocal.datosSesion.fechaServidor+'&detalle=""&id_session='+vm.servicioLocal.idSesionCaja+'&accion=session_caja_cuadrar').query().$promise.then(function(response) {
	          	vm.servicioLocal.datosDetalleCaja = [];
	          	vm.servicioLocal.datosDetalleCajaMedioPago = [];
	          	vm.servicioLocal.montosRegistrados =  {
											            0: 0,
											            1: 0,  
											            2: 0,
											            3: 0, 
											            4: 0,
											            5: 0
											        
											        };

				vm.servicioLocal.cantidadAtenciones = 0;

				vm.servicioLocal.montoAperturaCaja = 0;

				vm.servicioLocal.montoRecaudado = 0;

				vm.servicioLocal.totalMontoDiferencia = 0;


	            $state.go('cajaCuadrada');

	        });

    	}
      	vm.activaBotonDetalleMedioPago = function(idTipoPago){

  
      		$("tr").removeClass("PagoSeleccionado"); 
      		$("#id_tr_"+idTipoPago).addClass("PagoSeleccionado");
      		$("#bdetalle").attr("disabled",false);

      	}

      
      	var f = new Date();
      	
      	var mes = (f.getMonth() +1);
		if( mes < 9 ){

			mes = "0"+mes;

		}

 		vm.fecha_actual = f.getDate() + "-" + mes + "-" + f.getFullYear();

      	vm.verDetalleMedioPago = function(){
     
      		var idTipoPago = $(".PagoSeleccionado").attr("data-idPago");
      		vm.servicioMilliways.detalleCajaMedioPago(idTipoPago);

      	}

      	vm.eliminaCeros = function(value){ 
  
      		if($("#id_"+value+"_monto_recaudado").val() == 0){

				$("#id_"+value+"_monto_recaudado").val("");   

      		}     	

       	}

        vm.agregaCeros = function(value){

      		if($("#id_"+value+"_monto_recaudado").val() == ""){

				$("#id_"+value+"_monto_recaudado").val(0);   

      		}

        }

    	vm.calculaMontoPorMedioPago = function(nom_tipo_pago){

    		console.log("calculaMontoPorMedioPago");

    		var str = $("#id_"+nom_tipo_pago+"_monto_ws").text();
			var str= str.replace("$", ""); 
			var monto_ws = str.replace(".", "");  
        	var monto_recaudado = $("#id_"+nom_tipo_pago+"_monto_recaudado").val();

        	if(!monto_recaudado){

        		monto_recaudado = 0;

        	}

        	vm.servicioLocal.montoRegistadoEfectivo = monto_recaudado;
     		var diferencia = parseInt(monto_ws) -  parseFloat(monto_recaudado);

  			$("#id_"+nom_tipo_pago+"_diferencia").text(parseFloat(diferencia));

         
	        if(parseFloat(diferencia) > 0){
	     
	          $("#id_btn_validacion_"+nom_tipo_pago).removeClass().addClass("roj-roj input-group-addon");  
	          $("#id_btn_validacion_"+nom_tipo_pago).children().removeClass().addClass("glyphicon glyphicon-remove");           

	        }else if(parseFloat(diferencia) < 0){
	          
	          $("#id_btn_validacion_"+nom_tipo_pago).removeClass().addClass("roj-roj input-group-addon"); 
	          $("#id_btn_validacion_"+nom_tipo_pago).children().removeClass().addClass("glyphicon glyphicon-remove"); 

	        }else{

	           $("#id_btn_validacion_"+nom_tipo_pago).removeClass().addClass("ver-ver input-group-addon")
	           $("#id_btn_validacion_"+nom_tipo_pago).children().removeClass().addClass("glyphicon glyphicon-ok");          
    
	        }

        	var sumaMontoRegistado=0;

        	var countInputDisabled= 0;

        	var sumaDiferencia=0;


	        $("#tabla_cierre_caja tbody tr").each(function(k,v){
	       
	        	var valorMontoRegistado =  $("#id_"+k+"_monto_recaudado").val();

	        	if(!valorMontoRegistado){

	        		valorMontoRegistado = 0;

	        	}	 

    	        if($("#id_"+k+"_monto_ws").text() == 0){  

		            countInputDisabled++ // valor para comparar los con clase ver-ver

		            $("#id_"+k+"_monto_recaudado").attr("disabled",true);

		        }

	       		vm.servicioLocal.datosDetalleCaja[k]["montoRegistado"] = valorMontoRegistado;                  
	          	sumaMontoRegistado += parseInt(valorMontoRegistado);
	       
	          	$("#total_monto_recaudado_footer").text(sumaMontoRegistado);
	          	vm.servicioLocal.totalMontoRegistrado = sumaMontoRegistado;

	          	var diferenciaHead = parseInt(vm.servicioLocal.montoRecaudado)-parseInt(sumaMontoRegistado);

	        	$("#total_diferencia_head").text(diferenciaHead);

                vm.servicioLocal.montosRegistrados[k] = $("#id_"+k+"_monto_recaudado").val() ;

				// montos recaudados fin

	        	var diferencia =  $("#id_"+k+"_diferencia").text();
	       
	            if(!diferencia){

	        		diferencia = 0;

	          	}
	           
	        	sumaDiferencia += parseInt(diferencia);

	           	$("#total_diferencia_footer").text(sumaDiferencia);


	        	vm.servicioLocal.totalMontoDiferencia  = sumaDiferencia;

	        });


	        var incrementoActivaCuadraCaja = 0;
	        $("#tabla_cierre_caja .input-group span").each(function(k,v){

	             
	          if($(this).hasClass('ver-ver')) {

	              incrementoActivaCuadraCaja++


         	       if(incrementoActivaCuadraCaja == 6  - parseInt(countInputDisabled)){

	                $("#btn_cuadrar_caja").attr("disabled",false);

	              }else{

	                $("#btn_cuadrar_caja").attr("disabled",true);   
	              }

	          } 

	        });

      

      	}
      
      
    }
 
})();
