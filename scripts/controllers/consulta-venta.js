(function() {
'use strict';
 
/**
 * @ngdoc function
 * @name medipassBE.controller:ConsultaVentaController
 * @description
 * # ConsultaVentaController
 * Controller of the medipassBE
 */
angular.module('medipassBE')

.factory('Excel',function($window){
        var uri='data:application/vnd.ms-excel;base64,',
            template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
            format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
        return {
            tableToExcel:function(tableId,worksheetName){
                var table=$(tableId),
                    ctx={worksheet:worksheetName,table:table.html()},
                    href=uri+base64(format(template,ctx));
                return href;
            }
        };
    })

  .controller('ConsultaVentaController', ConsultaVentaController);

function ConsultaVentaController($scope,$state,$window, $timeout, $resource, $filter, DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,$uibModal,$localStorage,Excel,servicioMilliways,servicioLocal){
 
	var vm = this;
	var oTable = $('#CDV-T');
	vm.servicioMilliways = servicioMilliways;
    vm.datosSupervisor = servicioLocal.datosSupervisor;	
    vm.servicioLocal = servicioLocal;

  
	$scope.filename = "test";

 	$scope.getArray = [];
 		var cargaDatos = [];

	    angular.forEach(vm.servicioLocal.consultaVentas[0][0],function(v,k){

	    	cargaDatos[k] = v;
	    });


	   $scope.getArray = [{a: 1}, {b:3}];


      $scope.addRandomRow = function() {
        $scope.getArray.push({a: Math.floor((Math.random()*10)+1), b: Math.floor((Math.random()*10)+1)});
      };

      $scope.getHeader = function () {return ["A", "B"]};

      $scope.clickFn = function() {
      
      };
 
 	$scope.exportToExcel=function(){ 
 

        var exportHref=Excel.tableToExcel('#CDV-T','sheet name');
        console.log(exportHref);
        $timeout(function(){location.href=exportHref;},100);  

    }

  	vm.dtInstance = {};
	vm.someClickHandler = someClickHandler;
	vm.message = '';
	vm.message2 = '';
	vm.records = [];

  	vm.records =  vm.servicioLocal.consultaVentas[0];

  	vm.dtInstance = {};

 	vm.dtOptions = DTOptionsBuilder.newOptions().withDOM('<"exportar"B>rt<"col-sm-12 paginacion"p i><"clear">').withBootstrap().withOption('responsive', true).withOption('order', [[ 0, "desc" ]])
	 
		.withButtons([
	 {
			extend: 'pdfHtml5',
			className: 'pdf',
			text: ' ',
			orientation: 'landscape',
			exportOptions: {
			  columns: ':visible'
			},
		  },
		]).withLanguage({
		  'processing': 'Procesando...',
		  'lengthMenu': 'Mostrar _MENU_ registros',
		  'zeroRecords': 'No se encontraron resultados',
		  'emptyTable': 'Ningún dato disponible en esta tabla',
		  'info': '&nbsp;Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
		  'infoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
		  'infoFiltered': '(filtrado de un total de _MAX_ registros)',
		  'infoPostFix': '',
		  'search': 'Buscar:',
		  'url': '',
		  'infoThousands': ',',
		  'loadingRecords': 'Cargando...',
		  'paginate': {
			'first': '<<',
			'last': '>>',
			'next': '>',
			'previous': '<'
		  },
		  'aria': {
			'sortAscending': ': Activar para ordenar la columna de manera ascendente',
			'sortDescending': ': Activar para ordenar la columna de manera descendente'
		  }
		})

		.withPaginationType('full_numbers')
		.withOption('rowCallback', rowCallback);
  
		    vm.dtColumnDefs = [

		        DTColumnDefBuilder.newColumnDef(0),
		        DTColumnDefBuilder.newColumnDef(1),
		        DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3),		        
	        	DTColumnDefBuilder.newColumnDef(4),
        		DTColumnDefBuilder.newColumnDef(5),
	        	DTColumnDefBuilder.newColumnDef(6),
	            DTColumnDefBuilder.newColumnDef(7),
	        	DTColumnDefBuilder.newColumnDef(8),
	        	DTColumnDefBuilder.newColumnDef(9),
	            DTColumnDefBuilder.newColumnDef(10).notVisible(),
	       		DTColumnDefBuilder.newColumnDef(11).notVisible(),
	            DTColumnDefBuilder.newColumnDef(12).notVisible(),
	       		DTColumnDefBuilder.newColumnDef(13).notVisible(),
                DTColumnDefBuilder.newColumnDef(14).notVisible(),
	        	DTColumnDefBuilder.newColumnDef(15).notVisible(),
        		DTColumnDefBuilder.newColumnDef(16).notVisible(),
	        	DTColumnDefBuilder.newColumnDef(17).notVisible(),
                DTColumnDefBuilder.newColumnDef(18).notVisible(),
                DTColumnDefBuilder.newColumnDef(19).notVisible()
      
		    ];

  vm.fecha = {
    startDate: moment().startOf('month'),
    endDate: moment()
  };

  vm.opts = {
    locale: {
      format: 'YYYY-MM-DD',
      applyClass: 'btn-green',
      applyLabel: 'Aceptar',
      fromLabel: 'Desde:',
      toLabel: 'Hasta:',
      cancelLabel: 'Cancelar',
      customRangeLabel: 'Rango Personalizado',
      daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      firstDay: 1,
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre',
        'Octubre', 'Nombiembre', 'Diciembre'
      ]
    },
    maxDate: moment(),
    ranges: {
      'Hoy': [moment(), moment()],
      'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Los Ultimos 7 Dias': [moment().subtract(6, 'days'), moment()],
      'Los Ultimos 30 Dias': [moment().subtract(29, 'days'), moment()],
      'Mes Actual': [moment().startOf('month'), moment().endOf('month')],
      'Mes Anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
	eventHandlers: {
		'apply.daterangepicker': function(ev, picker) {

  			vm.records =  vm.servicioLocal.consultaVentas[0]; // cargo nuevamente el array total ya que si no lo actualizo queda reducido con los datos del filtro anterior  			

  			var val = $("#searchfecha").val().split(" - ");
  			var min = val[0];
        	var max = val[1];

			max = max.split("-");
			max = max[0]+"-"+max[1]+"-"+(parseInt(max[2])+1);
			 

        	min = min.replace("-", ".");
			min = min.replace("-", ".");
			max = max.replace("-", ".");
			max = max.replace("-", ".");


			min = (new Date(min.split(".").join("-")).getTime())/1000;
			max = (new Date(max.split(".").join("-")).getTime())/1000;
	 
        	var arrayToReturn = {}; 

	        var incrementa = 0;

	        $.each(vm.records,function(k,v){ 

	        	var fecha =  v.fecha_bono_unix;	 

	            if (fecha >= min )  {

	            	if (fecha <=  max)  {

	                	arrayToReturn[incrementa] = v ;
	        			incrementa++

	            	}
	            }

	        });
 	
	        vm.records = arrayToReturn;
  	 

		}
	}
  };


	$('#searchisapre').on( 'keyup', function () {

		oTable.dataTable().fnFilter( this.value , 12 );
	});
	$('#searchseguros').on( 'keyup', function () {
		oTable.dataTable().fnFilter( this.value , 14 );
	});
	$('#searchbono').on( 'keyup', function () {
		oTable.dataTable().fnFilter( this.value , 5 );
	});
	$('#searchtipo').on( 'keyup', function () {
		oTable.dataTable().fnFilter( this.value , 6 );
	});

 
  //checkbox de ocultar y desocultar columnas
  vm.checkboxModel = {
    value1: true,
    value2: true,
    value3: true,
    value4: true,
    value5: true,
    value6: true,
    value7: true,
    value8: true,
    value9: true,
    value10: false,
    value11: false,
    value12: false,
    value13: false,
    value14: false,
    value15: false,
    value16: false,
    value17: false,
    value18: false,
    value19: false,   
  };
  //oculta o muestra las columnas dado el numero de valor
  vm.showAndHide = function(column, value) {

    oTable.dataTable().fnSetColumnVis(column, value);
  };
 
	  //muestra el bono seleccionado en pantalla
	 function someClickHandler(id_atencion) {  //someClickHandler funcion propia datatable

		//Llamo al ws  consultaAtencionDetalle
		
		var cargaDatos = [];
		var cargaDatosObjeto = {}; 
    	var url = "http://"+vm.servicioLocal.subDominio.valor+".openpartner.cl/bono4/medipass_v1";
    	console.log(url);
		var pl = new SOAPClientParameters(); 
	
		pl.add("urn:idAtencion",id_atencion);// variable necesaria de envio al ws consultaAtencionDetalle

		SOAPClient.invoke(url, "consultaAtencionDetalle", pl, true,consultaAtencionDetalle_callBack);	// ejecuto el ws

		 function consultaAtencionDetalle_callBack(u){ // callBack  funcion SOAPClient.invoke

		 	// u valor respuesta de callBack  con los datos
			$.each(u,function(k,v){ 
				
		 	    cargaDatosObjeto = {

						idAtencion : v["ns:idAtencion"],

						apellidoAfiliado : v["ns:apellidoAfiliado"],

						apellidoBeneficiario : v["ns:apellidoBeneficiario"],

						bonificacion : v["ns:bonificacion"],

						cantidad : v["ns:cantidad"],

						codigoAtencion : v["ns:codigoAtencion"],

						codigoMedico : v["ns:codigoMedico"],

						codigoPrestacion : v["ns:codigoPrestacion"],

						copago : v["ns:copago"],

						fechaHoraBono : v["ns:fechaHoraBono"],

						fecha_bono_unix :  moment(v["ns:fechaHoraBono"]).unix(),

						ges : "xxxx",

						idAtencionDetalle : v["ns:idAtencionDetalle"],

						idEspecialidad : v["ns:idEspecialidad"],

						idEstatu : v["ns:idEstatus"],

						idPrestacion : v["ns:idPrestacion"],

						idRazonSocial : v["ns:idRazonSocial"],

						idTipoAtencion : v["ns:idTipoAtencion"],

						item : v["ns:item"],

						monto : v["ns:monto"],

						montoCaja : v["ns:montoCaja"],

						montoIsapre : v["ns:montoIsapre"],

						montoSeguro : v["ns:montoSeguro"],

						nombreAfiliado : v["ns:nombreAfiliado"],

						nombreBeneficiario : v["ns:nombreBeneficiario"],

						nombreEspecialidad : v["ns:nombreEspecialidad"],

						nombreEstadoAtencion : v["ns:nombreEstadoAtencion"],

						nombreEstatus : v["ns:nombreEstatus"],

						nombreFantasia : v["ns:nombreFantasia"],

						nombreMedico : v["ns:nombreMedico"],

						nombrePrestacion : v["ns:nombrePrestacion"],

						nombreRazonSocial : v["ns:nombreRazonSocial"],

						nombreTipoAtencion : v["ns:nombreTipoAtencion"],

						numeroBono : v["ns:numeroBono"],

						planGrupo : v["ns:planGrupo"],

						rh : v["ns:rh"],

						rutAfiliado : v["ns:rutAfiliado"]["ns:numero"]+"-"+v["ns:rutAfiliado"]["ns:dv"],

						rutBeneficiario : v["ns:rutBeneficiario"]["ns:numero"]+"-"+v["ns:rutBeneficiario"]["ns:dv"],

						rutRazonSocial : v["ns:rutRazonSocial"]["ns:numero"]+"-"+v["ns:rutRazonSocial"]["ns:dv"],

						totalBonificacion : v["ns:totalBonificacion"],

						totalCopago : v["ns:totalCopago"],

						totalPrestacion : v["ns:totalPrestacion"],

						usoExcedente : v["ns:usoExcedente"]

					}

		      	  
			      	cargaDatos[k] = cargaDatosObjeto;


			      });

		}
	

		vm.record = cargaDatos; // agrego los datos a vm.record los cuales se mostraran en la vista 
	
		var modalInstance = $uibModal.open({ // abre modal ui 
			animation: true,
			scope: $scope,
			size: 'lg',
			templateUrl: 'views/components/bono-modal.html',// html del modal 
			resolve: {
	      		record: function()  
	         	{ 
	            return vm.record;
	         	}
	     	},	 

			controller: function ($scope, $uibModalInstance, record) {


			 	$scope.ok = function () {

			         $uibModalInstance.close();

			    };

			    $scope.cancel = function () {

			        $uibModalInstance.dismiss('cancel');

			    };

			}
		  
		});
		 
	}



    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
 
       	$("td:not(:nth-child(2)) ",nRow).unbind('click');

        $("td:not(:nth-child(2)) ",nRow).bind('click', function() {
            $scope.$apply(function() {    

                vm.someClickHandler(aData[0]);

            });
        });
        return nRow;
    }




    vm.btnCancelarTransaccion = function () {
		$state.go('menu');
    };


    vm.openModalAnular = function(idAtencion,folio){

		var modalInstance = $uibModal.open({
		animation: true,
		scope: $scope,

		templateUrl: 'views/components/modal-anular-bono.html' 
		  
		});

    	$("#idAtencion").html(idAtencion);    	
    	$("#idFolio").html(folio);
 
    }


 
	vm.print = function () {

	  $timeout($window.print, 0);

	};


  	vm.confirmarTocSupervisor = function(){


  		var rut = $("#campo_texto_rut_supervisor").val();
  		var idAtencion = $("#idAtencion").text();
    	var folioFinanciador = $("#idFolio").text();
 

    	vm.servicioMilliways.validarSupervisor(rut);// llamo al metodo validarSupervisor para ver si es supervisor

    	$timeout(function() {	// doy tiempo para su rrespuesta 

    		if(vm.datosSupervisor[0].esSupervisor != -1 ){ // si es supervisor

				var url4 = "http://"+vm.servicioLocal.subDominio.valor+".openpartner.cl/bono4/medipass_v1";
				var pl = new SOAPClientParameters(); 
		 
		        pl.add("urn:folioFinanciador",folioFinanciador);
		        pl.add("urn:idBono",idAtencion);            
		        pl.add("urn:idUsuarioSupervisor",vm.datosSupervisor[0].idUsuario);            
		        pl.add("urn:perfilAnulacion","2"); 
		        pl.add("urn:idUsuarioCajero",vm.servicioLocal.datosSesion.idUsuario);
		        pl.add("urn:idSesionCaja",vm.servicioLocal.idSesionCaja); 		 
		  
				SOAPClient.invoke(url4, "anulaBono", pl, true,function(u){

					if(u["ns:responseDescription"] == "OK"){

			      		$("#id_anular_"+$("#idAtencion").text()).text("Anulada").addClass("roj-roj").removeClass("gri-gri").attr("disabled",true);	          		
			      		$("#con_toc").text("");
			      		$("#id_boton_login").attr("disabled",true); 	

						$timeout(function() {	

			      			$(".modal").click();

			      		}, 1500);

					}else{

			      		$(".modal").click();
				       	$("#alerta_mensajes").addClass("b_0");
	                    $("#contenido_mensaje").html(u["ns:responseDescription"]); 
	                    $("#modal_mensajes").modal('show'); 
			
					}
				});	


    		}else{ // si no es supervisor 

    				// NO SE QUE SE HACE
    		}


    	}, 1500);//-------------------fin  doy tiempo para su rrespuesta ----------------------------------------------
 

  	}

   	 

 




vm.download = function(fileName, mimeType) {

var data = vm.servicioLocal.consultaVentasExcel; 

var content = '';
var dataString;
data.forEach(function (infoArray, index) {
	console.log(infoArray);

  dataString = infoArray.join(';');

  content += index < data.length ? dataString + '\n' : dataString;
});



  var a = document.createElement('a');
  mimeType = mimeType || 'application/octet-stream';

  if (navigator.msSaveBlob) { // IE10
    return navigator.msSaveBlob(new Blob([content], { type: mimeType }), fileName);
  } else if ('download' in a) { //html5 A[download]
    a.href = 'data:' + mimeType + ',' + encodeURIComponent(content);
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    setTimeout(function() {
      a.click();
      document.body.removeChild(a);
    }, 66);
    return true;
  } else { //do iframe dataURL download (old ch+FF):
    var f = document.createElement('iframe');
    document.body.appendChild(f);
    f.src = 'data:' + mimeType + ',' + encodeURIComponent(content);

    setTimeout(function() {
      document.body.removeChild(f);
    }, 333);
    return true;
  }
}



}
})();




 

 

 

 
