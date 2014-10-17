'use strict';

angular.module('examples.about', [])
    .config(function ($routeProvider) {
        $routeProvider.when('/examples/about', {templateUrl: '/modules/examples/about/about.html', controller: 'AboutCtrl'});
    })
    .controller('AboutCtrl', function ($scope) {
        $scope.app = 'main';
        $scope.view = 'about';
        $scope.controller = 'AboutCtrl';
    });
