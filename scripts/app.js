(function () {
    'use strict';

    /**
     * @ngdoc overview
     * @name medipassBonoelectronicoApp
     * @description
     * # medipass-bonoelectronico
     *
     * Main module of the application.
     */
    angular
        .module('medipassBE', [
            'ngAnimate',
            'ngCookies',
            'ngResource',
            'ui.router',
            'door3.css',
            'ngLocale',
            'ui.select',
            'ngSanitize',
            'ngTouch',
            'angularSoap',
            'ui.bootstrap',
            'platanus.rut',
            'datatables',
            'datatables.buttons',
            'datatables.bootstrap',
            'daterangepicker',
            'uiRouterStyles',
            'angularMoment',
            'ng-currency',
            'smart-table',
            'vAccordion',
            'underscore',
            'ngStorage',
            'ngMessages',
            'ngSanitize',
            'ngCsv',
             
        
     

        ])

    .config(function ($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise('/identificacion-usuario');
        //$urlRouterProvider.otherwise('/identificacion-usuario-sin-toc');
        //
        // Now set up the states
        $stateProvider

        //estado de toc usuario
            .state('tocusuario', {
            url: '/identificacion-usuario',
            views: {

                // the main template will be placed here (relatively named)
                '': {
                    templateUrl: 'views/toc.html',
                    controller: 'TocController',
                    controllerAs: 'vm',

                },

                // the child views will be defined here (absolutely named)
                'offline@tocusuario': {
                    templateUrl: 'views/components/toc.offline.html',

                },

                // for column two, we'll define a separate controller
                'online@tocusuario': {
                    templateUrl: 'views/components/toc.online.html',

                    //controller: 'scotchController'
                },
            },
            data: {
                css: 'styles/toc.css',
            },
        })
        //estado de toc usuario sin toc
        .state('tocusuario-sin-toc', {
            url: '/identificacion-usuario-sin-toc',
            views: {

                // the main template will be placed here (relatively named)
                '': {
                    templateUrl: 'views/toc-sin-toc.html',
                    controller: 'TocController_sin_toc',
                    controllerAs: 'vm',

                },

                // the child views will be defined here (absolutely named)
                'offline@tocusuario': {
                    templateUrl: 'views/components/toc.offline.html',

                },

                // for column two, we'll define a separate controller
                'online@tocusuario': {
                    templateUrl: 'views/components/toc.online.html',

                    //controller: 'scotchController'
                },
            },
            data: {
                css: 'styles/toc.css',
            },
        })
        //estado de toc paciente
        .state('tocpaciente', {
                url: '/identificacion-paciente/:nombreOpcion',
                views: {

                    // the main template will be placed here (relatively named)
                    '': {
                        templateUrl: 'views/toc.html',
                        controller: 'TocController',
                        controllerAs: 'vm',
                    },

                    // the child views will be defined here (absolutely named)
                    'offline@tocpaciente': {
                        templateUrl: 'views/components/toc.offline.html',

                    },

                    // for column two, we'll define a separate controller
                    'online@tocpaciente': {
                        templateUrl: 'views/components/toc.online.html',

                        //controller: 'scotchController'
                    },
                },
                data: {
                    css: 'styles/toc.css',
                },
            })
            .state('aperturaCaja', {
                url: '/apertura-caja',
                templateUrl: 'views/apertura-caja.html',
                controller: 'CajaController',
                controllerAs: 'vm',
                data: {
                    css: 'styles/caj.css',
                },

            })
            .state('menu', {
                url: '/menu',
                templateUrl: 'views/menu.html',
                controller: 'MenuController',
                controllerAs: 'vm',

            })
            .state('consultaDeVenta', {
                url: '/consulta-venta',
                templateUrl: 'views/consulta-venta.html',
                controller: 'ConsultaVentaController',
                controllerAs: 'vm',
                data: {
                    css: ['styles/ram.css', 'styles/cdv.css'],
                },

            })

        .state('ram', {
                url: '/ram',

                views: {
                    '': {
                        templateUrl: 'views/ram.html',
                        controller: 'RamController',
                        controllerAs: 'vm',
                    },
                    'formBeneficiario@ram': {
                        templateUrl: 'views/components/ram.formulario.paciente.html',

                    },
                    'botones@ram': {
                        templateUrl: 'views/components/ram.botones.html',

                    },
                    'content@ram': {
                        templateUrl: 'views/components/ram.atencion.html',

                    },
                },

                data: {
                    css: 'styles/ram.css',
                },

            })


        .state('ramsimulacion', {
                url: '/ramsimulacion',

                views: {
                    '': {
                        templateUrl: 'views/ramsimulacion.html',
                        controller: 'RamsimulacionController',
                        controllerAs: 'vm',
                    },
                    'formBeneficiario@ramsimulacion': {
                        templateUrl: 'views/components/ramsimulacion.formulario.paciente.html',

                    },
                    'botones@ramsimulacion': {
                        templateUrl: 'views/components/ramsimulacion.botones.html',

                    },
                    'content@ramsimulacion': {
                        templateUrl: 'views/components/ramsimulacion.atencion.html',

                    },
                },

                data: {
                    css: 'styles/ram.css',
                },

            })

        .state('ramsimulacion.confirmacion', {
            url: '/confirmacion',

            views: {

                'content@ramsimulacion': {
                    templateUrl: 'views/components/ramsimulacion.confirmacion.html',

                },
            },

            data: {
                css: 'styles/ram.css',
            },

        })
            .state('ram.pago', {
                url: '/pago',

                views: {

                    'content@ram': {
                        templateUrl: 'views/components/ram.pago.html',

                    },
                },

                data: {
                    css: 'styles/ram.css',
                },

            })

        .state('ram.confirmacion', {
            url: '/confirmacion',

            views: {

                'content@ram': {
                    templateUrl: 'views/components/ram.confirmacion.html',

                },
            },

            data: {
                css: 'styles/ram.css',
            },

        })

        .state('simulacion', {
                url: '/identificacion-simulacion',
                views: {

                    // the main template will be placed here (relatively named)
                    '': {
                        templateUrl: 'views/toc_simulacion.html',
                        controller: 'TocController',
                        controllerAs: 'vm',
                    },

                    // the child views will be defined here (absolutely named)
                    'offline@tocpaciente': {
                        templateUrl: 'views/components/toc.offline.html',

                    },

                    // for column two, we'll define a separate controller
                    'online@tocpaciente': {
                        templateUrl: 'views/components/toc.online.html',

                        //controller: 'scotchController'
                    },
                },
                data: {
                    css: 'styles/toc.css',
                },
            })
            .state('copago', {
                url: '/copago',
                templateUrl: 'views/copago.html',
                controller: 'CopagoController',
                controllerAs: 'vm',
                data: {
                    css: ['styles/ram.css', 'styles/cop.css'],
                },

            })
            .state('directorioMedico', {
                url: '/directorio-medico',
                templateUrl: 'views/directorio-medico.html',
                controller: 'DirectorioMedicoController',
                controllerAs: 'vm',
                data: {
                    css: 'styles/dir.css',
                },

            })
            .state('cerrarCaja', {
                url: '/cierre-caja',
                templateUrl: 'views/cierre_caja.html',
                controller: 'CierreCajaController',
                controllerAs: 'vm',
                data: {
                    css: 'styles/caj.css',
                },

            })
             .state('detalleCajaMedioPago', {
                url: '/detalle-caja-medio-pago',
                templateUrl: 'views/detalle_caja_mediopago.html',
                controller: 'detalleCajaMedioPagoController',
                controllerAs: 'vm',
                data: {
                    css: 'styles/caj.css',
                },

            })

            .state('cajaCuadrada', {
                url: '/caja-cuadrada',
                templateUrl: 'views/caja-cuadrada.html',
                controller: 'CajaCuadradaController',
                controllerAs: 'vm',
                data: {
                    css: 'styles/caj.css',
                },

            });


 

    })

    .run(function (amMoment) {
        amMoment.changeLocale('es');
    })

    ;
})();

//https://github.com/jmdobry/angular-cache
//https://github.com/neoziro/angular-offline
//https://github.com/techfort/LokiJS/wiki
//http://embed.plnkr.co/4RalPOAeZA1xYyT3gpeB/preview
//http://igorizr1.github.io/wSQL/
//https://www.theodo.fr/blog/2015/04/how-to-automatically-update-your-angular-offline-webapps/
//http://blog.iterativ.ch/2014/09/04/create-offline-web-applications-with-angularjs/
//http://devcenter.kinvey.com/angular/guides/caching-offline
//

// https://github.com/andrewmcgivery/angular-soap

//http://jsfiddle.net/rommsen/QY8w2/    offline online
