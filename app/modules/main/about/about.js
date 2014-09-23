'use strict';

angular.module('main.about', [])
  .config(function ($stateProvider) {

    $stateProvider.state('mainAbout', {
      url: '/main/about',
      templateUrl: '/modules/main/about/about.html',
      controller: 'AboutCtrl',
      data: {
        app: 'main'
      }
    });
  })
  .controller('AboutCtrl', function ($scope) {
    $scope.view = 'about';
    $scope.controller = 'MainAboutCtrl';
  });
