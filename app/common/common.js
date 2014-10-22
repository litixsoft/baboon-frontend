'use strict';

angular.module('common', [])
    .constant('BASE_URI', 'http://localhost:8081/')
    .constant('API_KEY', '<<YOUR_API_KEY_HERE>>')
    .config(function ($locationProvider, $httpProvider, API_KEY) {
        $httpProvider.defaults.headers.common['x-access-apikey'] = API_KEY;
        // routing
        $locationProvider.html5Mode(true);
    });
