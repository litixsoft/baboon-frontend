'use strict';

angular.module('examples.test', [])
    .config(function ($routeProvider) {
        $routeProvider.when('/examples/test', {templateUrl: '/modules/examples/test/test.html'});
    });
