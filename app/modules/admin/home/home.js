'use strict';

angular.module('admin.home', [])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/admin/home', {
                templateUrl: 'modules/admin/home/home.html',
                controller: 'AdminHomeCtrl',
                app: 'admin'
            });
    })

  .controller('AdminHomeCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
