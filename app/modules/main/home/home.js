'use strict';

angular.module('main.home', [])
  .config(function ($stateProvider) {
    $stateProvider.state('mainHome', {
      url: '/main/home', templateUrl: '/modules/main/home/home.html', controller: 'HomeCtrl'
    });
  })
  .controller('HomeCtrl', function ($scope, $http, $lxSocket, $log ) {
    $scope.app = 'main';
    $scope.view = 'home';
    $scope.controller = 'HomeCtrl';

    $scope.$on('socket:test24', function (ev, data) {
      $log.info(data.status, data.res.response);
    });

    $lxSocket.forward('test24');
    $lxSocket.emit('test24', {test:'Daten vom Client'});
  });
