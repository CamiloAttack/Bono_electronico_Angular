(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name medipassBE.servicioLocal
     * @description
     * # servicioLocal
     * Service in the medipassBE.
     */
    angular.module('medipassBE')
        .service('servicioLocal', servicioLocal);





    function servicioLocal($state) {


     
        var subDominio = function () { // funcion para concatenar el dominio para url 
                                        //"http://"+vm.servicioLocal.subDominio.valor+".openpartner.cl/bono/bono_electronico_v2";

            var host = window.location.host;
            var subDominio = host.replace(".xxxx.cl", "");

            return {valor:subDominio};

        }; 

        this.subDominio = subDominio();

        var idSesionCaja;
        this.idSesionCaja;

//variables de cierre caja
        var detalleTipoPagoSeleccionado;
        this.detalleTipoPagoSeleccionado;

        var fechaAperturaCaja;
        this.fechaAperturaCaja;

        var montoAperturaCaja;
        this.montoAperturaCaja;

        var montoRecaudado = 0;
        this.montoRecaudado;


        var cantidadAtenciones;
        this.cantidadAtenciones;



        var montoAperturaCajaDetalle;
        this.montoAperturaCajaDetalle;

        var cantidadAtencionesDetalle;
        this.cantidadAtencionesDetalle;


        var enPagoAtencionDetalle = 0;
        this.enPagoAtencionDetalle;    


        var totalMontoRegistrado = 0;
        this.totalMontoRegistrado; 

        var totalMontoDiferencia = 0;
        this.totalMontoDiferencia;    



//Fin variables de cierre caja

//VARIABLES de formulario montoRecaudado

   /*     var montoRecaudadoEfectivo;
        this.montoRecaudadoEfectivo;

        var montoRecaudadoExcedente;
        this.montoRecaudadoExcedentea;

        var montoRecaudadoCheque;
        this.montoRecaudadoCheque;*/


//Fin VARIABLES de formulario montoRecaudado

    

        var numeroConvenio;
        this.numeroConvenio;

        var rutNuevoOantiguo;
        this.rutNuevoOantiguo;

        var lugarConvenio;
        this.lugarConvenio; 

        var sucursalVenta;
        this.sucursalVenta; 

        var rutConvenio;
        this.rutConvenio;  

        var rutMedico;
        this.rutMedico;     


        var codigoEspecialidad;
        this.codigoEspecialidad;   

        var numeroConvenio; 
        this.numeroConvenio;

        var datosDetalleCaja = function () {

            return [];

        }; 

        this.datosDetalleCaja = datosDetalleCaja();
        


        var datosDetalleCajaMedioPago = function () {

            return [];

        }; 

        this.datosDetalleCajaMedioPago = datosDetalleCajaMedioPago();



        var montosRegistrados = function () {

        return {
            0: 0,
            1: 0,  
            2: 0,
            3: 0, 
            4: 0,
            5: 0
            }
        }; 

        this.montosRegistrados = montosRegistrados();

        var consultaVentas = function () {

            return [];

        }; 

        this.consultaVentas = consultaVentas();

        var consultaVentasExcel = function () {

            return [];

        }; 

        this.consultaVentasExcel  = consultaVentasExcel();

 

        var datosMensaje = function () {

            return {

        };};

        this.datosMensaje = datosMensaje();

        var medicos = function () {

            return {};

        }; 

        this.medicos = medicos();

        var prestaciones = function () {

            return {};

        }; 

        this.prestaciones = prestaciones();

        var ArraycodigoEspecialidad = function () {

            return {};

        }; 

        this.ArraycodigoEspecialidad = ArraycodigoEspecialidad();        

        var datosPrestacionesValorizar



        var  cancelarRegitroAtencion  = function () {

            return {

            valor:null,            
 

            };
        };

        this.cancelarRegitroAtencion = cancelarRegitroAtencion();

        var datosSesion = function () { return {
 

        };};

        this.datosSesion = datosSesion();


        var datosPaciente = function () {

            return {
            nombre: null,
            apellidoPaterno: null,
            apellidoMaterno: null,
            rut: null,
             
            codigoEstadoBeneficiario: null,    
            codigoSeguro: null, 
            descuentoPorPlanilla: null,  
            direccionCalleBeneficiario: null,                
            direccionCiudadBeneficiario: null,  
            direccionComunaBeneficiario: null, 
            fechaNacimientoBeneficiario: null, 
            isapre: null, 
            montoExcedente: null, 
            nombreAcompanante: null, 
            nombreCotizante: null, 
            
            previsionBeneficiario: null, 
            responseCode: null, 
            responseDescription: null, 
            rutAcompanante: null, 
            rutCotizante: null, 
            seguro: null, 
            sexo: null, 


        };};

        this.datosPaciente = datosPaciente();


        var datosSupervisor = [];

        this.datosSupervisor = datosSupervisor;




        var atencion = function () {
            return {
            _id: null,
            datosAtencion: {
                idAtencion: null,
                fecha: null,
                tipoAtencion: null,
                estadoAtencion: null,

            },
            datosTitular: {

                nombre: null,
                apellidoPaterno: null,                
                apellidoMaterno: null,
                rut: null,

            },
            datosBeneficiario: {

                nombre: null,
                apellidoPaterno: null,
                apellidoMaterno: null,
                rut: null,
                sexo: null,
                fechaNacimiento: null,
                direccion: null,
                ciudad: null,
                rutAcompanante: null,
                nombreAcompanante: null,
                telefono: null,
                montoExedente: null,
                montoExcedenteUsar: null,

            },
            datosIsapre: {

                nombre: null,
                abbr: null,
                codigo: null,
                montoExedente: null,
                descuentoXPlanilla: null,
                prevision: null,
                glosa: null,
                plan: null,
                codigoEstatusBeneficiarioIsapre: null,
                descripcionEstadoBeneficiarioIsapre: null,
                totalCopago: null,
                homologoNumeroConvenio: null,
                homologoLugarConvenio: null,
                homologoSucursal: null,
                rutConvenio: null,
                codigoConvenio: null,
                tratamientoMedico: null,
                codigoDiagnostico: null,
                nivelConvenio: null,
                urgencia: null,
                numeroPrestaciones: null,
                numeroFolio: null,

            },
            datosSeguro: {

                nombre: null,
                abbr: null,
                codigo: null,
                numeroOperacion: null,
                codigoEstatusBeneficiarioSeguro: null,
                codigoLugarAtencion: null,

            },
            datosCcaf: {
                nombre: null,
                abbr: null,
                codigo: null,
            },
            datosPrestaciones: [
               /* responseCode:null,
                montoPrestacion:null,
                montoFinanciador:null,
                montoCopago:null,
                glosaIsapre:null,

                bonificaciones:{
                    glosa:null,
                    tipo:null,
                    copago:null,
                },*/

 

            ],
            datosPrestacionesParticular: [
               /* responseCode:null,
                montoPrestacion:null,
                montoFinanciador:null,
                montoCopago:null,
                glosaIsapre:null,

                bonificaciones:{
                    glosa:null,
                    tipo:null,
                    copago:null,
                },*/

 

            ],


  
            datosPrestacionesInsert: [],
            
            datosPrestacionesComprobante: [],
            datosPrestacionesComprobanteImprimir : [],

            datosFolio: [],

            datosEnvioPrestacionesInsert: [],

            datosHeaderPrestacionesValorizar: [],

            datosPrestacionesValorizar: [],

            datosCargaEnvioBono: [],


            datosFinalEnvioBono: [],


            datosIdAtencion : [],


            datosCopagoTotales:{
            

            },

            datosBonificacionTotales:{
            

            },

            totalMontoComprobante :{

            },

            totalExedenteComprobante :{

            },      
            pagoRow: [],

            datosUsuario: {
                nombreCompletoUsuario: null,
                rut: null,
                nombreEquipo: null,
                nroCaja: null,
                lugarAtencionId: null,
                lugarAtencionNombre: null,
                sucursalId: null,
                susursalNombre: null,
                razonSocialRut: null,
                prestadorId: null,
                prestadorNombre: null,

            },

            datosPago: {
                idPago: null,
                totales: {
                    total: 0,
                    montoEfectivo: null,
                    montoCheque: null,
                    montoExcedente: null,
                    montoExcedenteUsar: null,
                    montoExcedenteInicial: null,                    
                    montoCcaf: null,
                    montoTarjetaCredito: null,
                    montoTarjetaDebito: null,
                    montoIsapre: null,
                    montoSeguro: null,
                    copago: null,
                },

                tiposPago: [],



            },

        };};

        this.atencion = atencion();



      /*  localStorage.setItem("test", JSON.stringify(datosSesion));
        var datosSesion2 = localStorage.getItem("test");
        datosSesion = JSON.parse(datosSesion2); //var test is now re-loaded!
        console.log('datosSesion');                      
        console.log(datosSesion);*/

        this.estadoAtencion = [{
            id: 1,
            descripcion: 'NUEVA',
        }, {
            id: 2,
            descripcion: 'VALORIZADA',
        }, {
            id: 3,
            descripcion: 'POR PAGAR',
        }, {
            id: 4,
            descripcion: 'PAGADA',
        }, {
            id: 5,
            descripcion: 'CONFIRMADA',
        }, ];

        this.tipoPago = [{
            id: 1,
            descripcion: 'EFECTIVO',
        }, {
            id: 2,
            descripcion: 'CHEQUE',
        }, {
            id: 3,
            descripcion: 'TRAJETA DEBITO',
        }, {
            id: 4,
            descripcion: 'TARJETA CRÉDITO',
        }, {
            id: 5,
            descripcion: 'CRÉDITO CCAF',
        }, {
            id: 4,
            descripcion: 'BONO PRE EMITIDO',
        }, {
            id: 5,
            descripcion: 'PAGO CON EXCEDENTE',
        }, ];

        this.tipoAtenciones = [{
            id: 1,
            descripcion: 'ONLINE',
            tipoPago: [{
                id: 1,
                descripcion: 'EFECTIVO',
            }, {
                id: 2,
                descripcion: 'CHEQUE',
            }, {
                id: 3,
                descripcion: 'TRAJETA DEBITO',
            }, {
                id: 4,
                descripcion: 'TARJETA CRÉDITO',
            }, {
                id: 5,
                descripcion: 'CRÉDITO CCAF',
            }, {
                id: 6,
                descripcion: 'BONO PRE EMITIDO',
            }, {
                id: 7,
                descripcion: 'PAGO CON EXCEDENTE',
            }, ],
        }, {
            id: 2,
            descripcion: 'OFFLINE',
            tipoPago: [{
                id: 8,
                descripcion: 'EMITIR PAGARE',
            }, ],
        }, {
            id: 3,
            descripcion: 'PARTICULAR',
            tipoPago: [{
                    id: 1,
                    descripcion: 'EFECTIVO',
                }, {
                    id: 2,
                    descripcion: 'CHEQUE',
                }, {
                    id: 3,
                    descripcion: 'TRAJETA DEBITO',
                }, {
                    id: 4,
                    descripcion: 'TARJETA CRÉDITO',
                },

                {
                    id: 6,
                    descripcion: 'BONO PRE EMITIDO',
                },
            ],
        }, ];

        this.items = [{
            id: 1,
            codigo: 'H',
            nombre: 'Honorario',
        }, {
            id: 2,
            codigo: 'P',
            nombre: 'Pabellón',
        }, {
            id: 3,
            codigo: 'A',
            nombre: 'Anestesia',
        }, ];
        this.ges = [{
            id: 1,
            codigo: ' ',
            nombre: ' ',
        }, ];

        this.getDatosSesion = function () {
            return this.datosSesion;
        };

        this.getDatosPaciente = function () {
            return this.datosPaciente;
        };

        this.getAtencion = function () {
            return this.atencion;
        };

        this.setDatosSesion = function (nuevoDatosSesion) {
            this.datosSesion = nuevoDatosSesion;
            console.log(this.datosSesion);

        };

        this.setDatoPaciente = function (nuevoDatosPaciente) {
            this.datosPaciente = nuevoDatosPaciente;
            console.log(this.datosPaciente);

        };

        this.setAtencion = function (nuevoDatosTransaccion) {
            this.atencion = nuevoDatosTransaccion;
            console.log(this.atencion);

        };

        this.pushDatosSesion = function (nuevoDatosSesion) {

            angular.merge(this.datosSesion, nuevoDatosSesion);
        
        };

        this.pushDatosPaciente = function (nuevoDatosPaciente) {

            angular.merge(this.datosPaciente, nuevoDatosPaciente);
            console.log(this.datosPaciente);

        };


        this.pushDatosSupervisor = function (nuevoDatosSupervisor) {

            angular.merge(this.datosSupervisor, nuevoDatosSupervisor);
            console.log(this.datosSupervisor);
        
        };


     /*   this.pushDatosTransaccion = function (nuevoDatosTransaccion) {

            angular.merge(this.atencion, nuevoDatosTransaccion);

        };*/

        this.limpiarDatosSesion = function () {
            this.datosSesion = datosSesion();

        };

        this.limpiarDatoPaciente = function () {
            this.datosPaciente = datosPaciente();
        };

        this.limpiarAtencion = function () {
            this.atencion = atencion();
 
        };




        this.limpiaDatosAtencion = function(){
                       

           // this.servicioLocal.cancelarRegitroAtencion.valor = true;
          // this.limpiarDatoPaciente();
            this.datosPaciente = {};
            this.datosPaciente = [];
            this.atencion.datosBonificacionTotales = {};
            this.atencion.datosCopagoTotales = {};

            

            this.atencion.datosCargaEnvioBono =  [];
            this.atencion.datosEnvioPrestacionesInsert = [];

            this.atencion.datosFolio = []; 
            this.atencion.datosIdAtencion = []; 
            this.atencion.datosIsapre = {};
            this.atencion.datosPago =  {
                        idPago: null,
                        totales: {
                            total: 0,
                            montoEfectivo: null,
                            montoCheque: null,
                            montoExcedente: null,
                            montoCcaf: null,
                            montoTarjetaCredito: null,
                            montoTarjetaDebito: null,
                            montoIsapre: null,
                            montoSeguro: null,
                            copago: null,
                        },

                        tiposPago: [],



                    }


            this.atencion.datosPrestaciones = [];
        //    this.atencion.datosPaciente.montoExcedente = {};
            this.atencion.datosPrestacionesComprobante = []; 
            this.atencion.datosPrestacionesInsert= []; 
            this.atencion.datosPrestacionesValorizar = []; 
            this.atencion.datosSeguro = {};
            this.atencion.datosTitular  = {};
            this.atencion.totalMontoComprobante = {};      


 
   
            $state.go('menu');


        }


        this.limpiaDatosAtencionParticular = function(){
                       

           // this.servicioLocal.cancelarRegitroAtencion.valor = true;
          // this.limpiarDatoPaciente();
         

            this.atencion.datosBonificacionTotales = {};
            this.atencion.datosCopagoTotales = {};

            

            this.atencion.datosCargaEnvioBono =  [];
            this.atencion.datosEnvioPrestacionesInsert = [];

            this.atencion.datosFolio = []; 
            this.atencion.datosIdAtencion = []; 
            this.atencion.datosIsapre = {};
            this.atencion.datosPago =  {
                        idPago: null,
                        totales: {
                            total: 0,
                            montoEfectivo: null,
                            montoCheque: null,
                            montoExcedente: null,
                            montoCcaf: null,
                            montoTarjetaCredito: null,
                            montoTarjetaDebito: null,
                            montoIsapre: null,
                            montoSeguro: null,
                            copago: null,
                        },

                        tiposPago: [],



                    }


           this.atencion.datosPrestaciones = [];
        //    this.atencion.datosPaciente.montoExcedente = {};
            this.atencion.datosPrestacionesComprobante = []; 
            this.atencion.datosPrestacionesInsert= []; 
            this.atencion.datosPrestacionesValorizar = []; 
            this.atencion.datosSeguro = {};
       //     this.atencion.datosTitular  = {};
            this.atencion.totalMontoComprobante = {};      


 
   
            $state.go('ram');


        }

    }
})();
