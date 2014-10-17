'use strict';

angular.module('auth', [
    'ngRoute',
    'ngMessages',
    'common.servererror',
    'common.equals',
    'common.utils',
    'auth.services',
    'auth.login',
    'auth.register',
    'auth.password',
    'auth.confirmation'
])
    .constant('ACTIVE_APP', 'auth')
    .constant('BASE_URI', 'http://localhost:8081/')
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');

        // routing
        $locationProvider.html5Mode(true);
        $routeProvider.otherwise({redirectTo: '/auth/login'});
    })
    .factory('authInterceptor', function ($q, $location, BASE_URI) {
        return {
            request: function (config) {
                if (config.url.indexOf('auth/') === 0) {
                    config.url = BASE_URI + config.url;
                }
                return config;
            }
        };
    });

