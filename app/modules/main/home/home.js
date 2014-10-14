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

    //$http.post('http://127.0.0.1:9000/api/echo', {test: 'data'}).
    //  success(function(data) {
    //    console.log('$http.get: receive rest response from server');
    //    console.log(data);
    //  });
  });
