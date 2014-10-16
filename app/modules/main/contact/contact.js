'use strict';

angular.module('main.contact', [])
    .config(function ($routeProvider) {
        $routeProvider.when('/main/contact', {templateUrl: '/modules/main/contact/contact.html', controller: 'ContactCtrl'});
    })
    .controller('ContactCtrl', function ($scope) {
        $scope.app = 'main';
        $scope.view = 'contact';
        $scope.controller = 'ContactCtrl';
    });
