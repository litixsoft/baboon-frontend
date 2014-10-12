'use strict';

angular.module('main.home', [])
  .config(function ($stateProvider) {
    $stateProvider.state('mainHome', {
      url: '/main/home', templateUrl: '/modules/main/home/home.html', controller: 'HomeCtrl'
    });
  })
  .controller('HomeCtrl', function ($scope, $http, $lxTransport) {
    $scope.app = 'main';
    $scope.view = 'home';
    $scope.controller = 'HomeCtrl';



    $scope.getData = function () {
      $scope.message = '';

      $lxTransport.get('/users')
        .success(function (success) {
          console.log('server response with status:', success.status);
          $scope.message = success.data;
        })
        .error(function (err) {
          console.error(err.data.message, err.data.stack);
        });



      //$lxTransport.rest()
      //  .get('/users/53baeb8da234dc09d1000002')
      //  .then(success, error);

      //

      //.emit('/users', {name:'josef'})
      //.timeout(2000)
      ////.rest('GET', 6000)
      //.params({id:12})
      //.header({'x-cookie':'test 24'})
      //.timeout(2000)
      //.retry()
      //.success(function (data) {
      //  console.log('success');
      //  $scope.message = data;
      //})
      //.error(function (err) {
      //  console.log('status: ' + err.status + ' error:', err.message);
      //});

      //$lxTransport.socket('/users/:id', 5000)// route and timeout (default 5000, 0 for no timeout )
      //  .setRequestParams({}) // set request params
      //  .setRequestBody({}) // set request body
      //  .setRequestHeader({api:'213123123'}) // set request header
      //  .then(function (data) { // future
      //    $scope.message = data;
      //  })
      //  .retryRest('get', 5000) // retryRest when socket timeout or socket not connected method and timeout for retry over rest
      //  .error(function(err) {
      //    console.log(err);
      //  });
      //$trp.get('/users', {}, function (err, res) {
      //  $scope.message = res;
      //}, null, true);
      //$lxSocket.emit('/users', {}, function (err, res) {
      //  $scope.message = res;
      //});
    };

    //$http.post('http://127.0.0.1:9000/api/echo', {test: 'data'}).
    //  success(function(data) {
    //    console.log('$http.get: receive rest response from server');
    //    console.log(data);
    //  });
  });
