'use strict';

angular.module('main.contact', [])
  .config(function ($stateProvider) {

    $stateProvider.state('mainContact', {
      url: '/main/contact', templateUrl: '/modules/main/contact/contact.html', controller: 'ContactCtrl'});
  })

  .controller('ContactCtrl', function ($scope) {
    $scope.view = 'contact';
    $scope.controller = 'ContactCtrl';
  });
