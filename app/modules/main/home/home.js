'use strict';

angular.module('main.home', [])
  .config(function ($stateProvider) {
    $stateProvider.state('mainHome', {
      url: '/main/home', templateUrl: '/modules/main/home/home.html', controller: 'HomeCtrl'
    });
  })
  .controller('HomeCtrl', function ($scope) {
    $scope.app = 'main';
    $scope.view = 'home';
    $scope.controller = 'HomeCtrl';
  });
