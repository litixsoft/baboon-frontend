'use strict';

angular.module('examples.home', [])
    .config(function ($routeProvider) {
        $routeProvider.when('/examples/home', {templateUrl: '/modules/examples/home/home.html'});
    });
