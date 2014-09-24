'use strict';

angular.module('main.contact', [])
  .config(function ($stateProvider) {

    $stateProvider.state('mainContact', {
      url: '/main/contact', templateUrl: '/modules/main/contact/contact.html', controller: 'ContactCtrl'
    });
  })

  .controller('ContactCtrl', function ($scope) {
    $scope.app = 'main';
    $scope.view = 'contact';
    $scope.controller = 'ContactCtrl';
  });
