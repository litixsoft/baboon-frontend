'use strict';

angular.module('auth', [
    'ngMessages',
    'ui.router',
    'ui.bootstrap',
    'auth.services',
    'common.servererror',
    'common.equals',
    'auth.login',
    'auth.register',
    'auth.password',
    'auth.confirmation'
])
    .constant('ACTIVE_APP', 'auth')
    .constant('BASE_URI', 'http://localhost:8081/')
    .config(function ($urlRouterProvider, $locationProvider, $httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');

        // Routing and navigation
        $urlRouterProvider.otherwise('/auth/login');
        $locationProvider.html5Mode(true);
    })
    .factory('authInterceptor', function($q, $location, BASE_URI) {
        return {
            request: function (config) {
                if(config.url.indexOf('auth/') === 0) {
                    config.url = BASE_URI + config.url;
                }
                return config;
            }
        };
    });

