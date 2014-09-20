'use strict';

angular.module('main.navExample', [])
  .config(function ($stateProvider) {
    $stateProvider.state('mainNavExample', {
      url: '/main/nav-example',
      templateUrl: '/modules/main/nav_example/nav_example.html',
      controller: 'NavExampleCtrl'
    });
  })

  .controller('NavExampleCtrl', function ($scope) {
    $scope.view = 'NavExample';
    $scope.controller = 'NavExampleCtrl';
  });
