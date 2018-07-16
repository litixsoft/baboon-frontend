'use strict';

angular.module('auth', [
    'ngRoute',
    'ngMessages',
    'ui.bootstrap',
    'lx.focus',
    'common',
    'common.servererror',
    'common.equals',
    'common.utils',
    'common.auth',
    'auth.login',
    'auth.register',
    'auth.password',
    'auth.confirmation'
])
    .constant('ACTIVE_APP', 'auth')
    .config(function ($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
        $routeProvider.otherwise({ redirectTo: '/auth/login' });
    })
    .factory('authInterceptor', function (BASE_URI) {
        return {
            request: function (config) {
                if (config.url.indexOf('auth/') === 0) {
                    config.url = BASE_URI + config.url;
                }
                return config;
            }
        };
    });

