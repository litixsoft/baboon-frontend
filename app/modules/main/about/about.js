'use strict';

angular.module('main.about', [])
    .config(function ($routeProvider) {
        $routeProvider.when('/main/about', {templateUrl: '/modules/main/about/about.html', controller: 'AboutCtrl'});
    })
    .controller('AboutCtrl', function ($scope) {
        $scope.app = 'main';
        $scope.view = 'about';
        $scope.controller = 'AboutCtrl';
    });
